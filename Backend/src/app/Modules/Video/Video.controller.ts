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

// Background function to process prediction
const processPredictionInBackground = async (
  videoId: string,
  tempFilePath: string,
  originalname: string,
) => {
  try {
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
        timeout: 300000, // 5 minutes timeout
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ Video ${videoId} prediction failed:`, error);

    // Update video status to failed
    await VIDEOServices.updateVIDEOInDB(videoId, {
      status: 'failed',
    });
  } finally {
    // Clean up temporary file
    if (fs.existsSync(tempFilePath)) {
      await fs.promises.unlink(tempFilePath);
    }
  }
};

const createVIDEO = catchAsync(async (req, res) => {
  // Check if video file is present in the request
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No video file uploaded',
    });
  }

  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  const videoFile = req.file;
  const tempFilePath = path.join(process.cwd(), `${Date.now()}_temp.mp4`);

  try {
    // Save the uploaded video temporarily
    await fs.promises.writeFile(tempFilePath, videoFile.buffer);

    // Prepare file for MinIO upload
    const file = {
      path: tempFilePath,
      originalname: `${Date.now()}_${videoFile.originalname}`,
      buffer: videoFile.buffer,
      size: videoFile.size,
    };

    // Upload to MinIO
    await uploadToMinIO(bucketName, file);

    const fileUrl = `/${bucketName}/${file.originalname}`;

    // Prepare data for database with 'processing' status and authenticated user
    const VIDEOData = {
      ...req.body,
      fileUrl,
      status: 'processing' as const,
      user: req.user._id, // Use authenticated user's ID
    };

    // Save to database immediately with 'processing' status
    const result = await VIDEOServices.createVIDEOIntoDB(VIDEOData);

    // Start background prediction processing (non-blocking)
    processPredictionInBackground(
      result._id.toString(),
      tempFilePath,
      videoFile.originalname,
    )
      // eslint-disable-next-line no-console
      .catch((err) => console.error('Background processing error:', err));

    // Send immediate response
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
    // Clean up temporary file on error
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
    // Get file metadata to determine size
    const stat = await minioClient.statObject(bucketName, fileName);
    const fileSize = stat.size;

    // Parse range header
    const range = req.headers.range;

    if (range) {
      // Parse range header (e.g., "bytes=0-1023")
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      // Set response headers for partial content
      res.status(206); // Partial Content
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', chunkSize);
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Cache-Control', 'no-cache');

      // Stream the requested range
      const stream = await minioClient.getObject(bucketName, fileName);
      
      let bytesRead = 0;
      let shouldSkip = true;

      stream.on('data', (chunk) => {
        if (shouldSkip) {
          // Skip bytes until we reach the start position
          if (bytesRead + chunk.length <= start) {
            bytesRead += chunk.length;
            return;
          } else if (bytesRead < start) {
            // Partial skip - we've reached the start position mid-chunk
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

        // Send bytes within the requested range
        if (bytesRead + chunk.length <= end + 1) {
          bytesRead += chunk.length;
          res.write(chunk);
        } else {
          // This is the last chunk in the range
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

      // Handle client disconnect
      req.on('close', () => {
        if (stream && !stream.destroyed) {
          stream.destroy();
        }
      });
    } else {
      // No range requested, stream the entire file
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
