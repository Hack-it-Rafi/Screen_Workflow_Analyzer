// import httpStatus from 'http-status';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VIDEOServices } from './Video.service';
import { uploadToMinIO, minioClient } from './Video.utility';

const bucketName = 'video-files';

// Helper function to get video duration/size based timeout
const getTimeoutForVideo = (fileSize: number): number => {
  // Base timeout: 10 minutes for small videos
  const baseTimeout = 600000; // 10 minutes

  // Add 5 minutes for every 50MB
  const sizeMB = fileSize / (1024 * 1024);
  const additionalTimeout = Math.floor(sizeMB / 50) * 300000;

  // Maximum 30 minutes timeout
  return Math.min(baseTimeout + additionalTimeout, 1800000);
};

// Background function to process prediction with retry
const processPredictionInBackground = async (
  videoId: string,
  tempFilePath: string,
  originalname: string,
  fileSize: number,
  retryCount = 0,
) => {
  const maxRetries = 2;
  const timeout = getTimeoutForVideo(fileSize);

  try {
    // eslint-disable-next-line no-console
    console.log(
      `🎬 Processing video ${videoId} (${(fileSize / (1024 * 1024)).toFixed(2)}MB, timeout: ${timeout / 1000}s, attempt: ${retryCount + 1}/${maxRetries + 1})`,
    );

    // Send video to prediction service
    const formData = new FormData();
    formData.append('video', fs.createReadStream(tempFilePath), {
      filename: originalname,
      contentType: 'video/mp4',
    });

    const predictionResponse = await axios.post(
      'http://localhost:5000/predict',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );

    const prediction = predictionResponse.data;

    // Update video with prediction and status
    await VIDEOServices.updateVIDEOInDB(videoId, {
      prediction: JSON.stringify(prediction),
      status: 'completed',
    });

    // eslint-disable-next-line no-console
    console.log(`✅ Video ${videoId} prediction completed successfully`);
  } catch (error: unknown) {
    const axiosError = error as {
      code?: string;
      message?: string;
      response?: { data?: { message?: string } };
    };
    const isTimeout =
      axiosError.code === 'ECONNABORTED' ||
      axiosError.message?.includes('timeout');
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Unknown error';

    // eslint-disable-next-line no-console
    console.error(
      `❌ Video ${videoId} prediction failed (attempt ${retryCount + 1}/${maxRetries + 1}):`,
      {
        error: errorMessage,
        code: axiosError.code,
        isTimeout,
      },
    );

    // Retry logic for timeout errors
    if (isTimeout && retryCount < maxRetries) {
      // eslint-disable-next-line no-console
      console.log(
        `🔄 Retrying video ${videoId} prediction (attempt ${retryCount + 2}/${maxRetries + 1})...`,
      );

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, 5000 * (retryCount + 1)),
      );

      return processPredictionInBackground(
        videoId,
        tempFilePath,
        originalname,
        fileSize,
        retryCount + 1,
      );
    }

    // Update video status to failed with error details
    await VIDEOServices.updateVIDEOInDB(videoId, {
      status: 'failed',
      prediction: JSON.stringify({
        error: errorMessage,
        errorCode: axiosError.code,
        timestamp: new Date().toISOString(),
        attempts: retryCount + 1,
      }),
    });
  } finally {
    // Clean up temporary file only after all retries
    if (retryCount >= maxRetries || !fs.existsSync(tempFilePath)) {
      if (fs.existsSync(tempFilePath)) {
        await fs.promises.unlink(tempFilePath);
        // eslint-disable-next-line no-console
        console.log(`🗑️  Cleaned up temp file for video ${videoId}`);
      }
    }
  }
};

const createVIDEO = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No video file uploaded',
    });
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  const videoFile = req.file;
  const tempFilePath = path.join(process.cwd(), `${Date.now()}_temp.mp4`);

  try {
    await fs.promises.writeFile(tempFilePath, videoFile.buffer);

    const file = {
      path: tempFilePath,
      originalname: `${Date.now()}_${videoFile.originalname}`,
      buffer: videoFile.buffer,
      size: videoFile.size,
    };

    await uploadToMinIO(bucketName, file);

    const fileUrl = `/${bucketName}/${file.originalname}`;

    const VIDEOData = {
      ...req.body,
      fileUrl,
      status: 'processing' as const,
      user: req.user._id,
    };

    const result = await VIDEOServices.createVIDEOIntoDB(VIDEOData);

    // Start background prediction processing with file size for timeout calculation
    processPredictionInBackground(
      result._id.toString(),
      tempFilePath,
      videoFile.originalname,
      videoFile.size,
      0,
    )
      // eslint-disable-next-line no-console
      .catch((err) => console.error('Background processing error:', err));

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Video uploaded successfully. Processing started.',
      data: {
        _id: result._id,
        caption: result.caption,
        fileUrl: result.fileUrl,
        status: result.status,
        user: result.user,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    });
  } catch (error) {
    if (fs.existsSync(tempFilePath)) {
      await fs.promises.unlink(tempFilePath);
    }
    throw error;
  }
});

const getAllVIDEOs = catchAsync(async (req, res) => {
  const result = await VIDEOServices.getAllVIDEOsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'VIDEOs are retrieved successfully',
    data: result,
  });
});

const getSingleVIDEO = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await VIDEOServices.getSingleVIDEOFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'VIDEO is retrieved successfully',
    data: result,
  });
});

const getVIDEOFile = catchAsync(async (req, res) => {
  const { fileName } = req.params;
  try {
    const stat = await minioClient.statObject(bucketName, fileName);
    const fileSize = stat.size;

    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', chunkSize);
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Cache-Control', 'no-cache');

      const stream = await minioClient.getObject(bucketName, fileName);

      let bytesRead = 0;
      let shouldSkip = true;

      stream.on('data', (chunk) => {
        if (shouldSkip) {
          if (bytesRead + chunk.length <= start) {
            bytesRead += chunk.length;
            return;
          } else if (bytesRead < start) {
            const offset = start - bytesRead;
            bytesRead = start;
            shouldSkip = false;

            const remainingInRange = end - bytesRead + 1;
            const chunkToSend = chunk.slice(offset, offset + remainingInRange);
            bytesRead += chunkToSend.length;
            res.write(chunkToSend);

            if (bytesRead > end) {
              stream.destroy();
              res.end();
            }
            return;
          }
        }

        if (bytesRead + chunk.length <= end + 1) {
          bytesRead += chunk.length;
          res.write(chunk);
        } else {
          const remaining = end - bytesRead + 1;
          const finalChunk = chunk.slice(0, remaining);
          res.write(finalChunk);
          stream.destroy();
          res.end();
        }
      });

      stream.on('end', () => {
        if (!res.writableEnded) {
          res.end();
        }
      });

      stream.on('error', (error) => {
        // eslint-disable-next-line no-console
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error streaming video', error });
        } else if (!res.writableEnded) {
          res.end();
        }
      });

      req.on('close', () => {
        if (stream && !stream.destroyed) {
          stream.destroy();
        }
      });
    } else {
      res.setHeader('Content-Length', fileSize);
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'no-cache');

      const stream = await minioClient.getObject(bucketName, fileName);
      stream.pipe(res);

      stream.on('error', (error) => {
        // eslint-disable-next-line no-console
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Error streaming video', error });
        } else if (!res.writableEnded) {
          res.end();
        }
      });

      req.on('close', () => {
        if (stream && !stream.destroyed) {
          stream.destroy();
        }
      });
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: 'Could not retrieve file.', error });
    }
  }
});

export const VIDEOControllers = {
  createVIDEO,
  getSingleVIDEO,
  getAllVIDEOs,
  getVIDEOFile,
};
