// import httpStatus from 'http-status';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { VIDEOServices } from './Video.service';
import { getObjectFromMinIO, uploadToMinIO } from './Video.utility';

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

    // Prepare data for database with 'processing' status
    const VIDEOData = {
      ...req.body,
      fileUrl,
      status: 'processing' as const,
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
    const content = await getObjectFromMinIO(bucketName, fileName);
    res.status(200).json({ filename: fileName, content: content });
  } catch (error) {
    res.status(500).json({ message: 'Could not retrieve file.', error });
  }
});

export const VIDEOControllers = {
  createVIDEO,
  getSingleVIDEO,
  getAllVIDEOs,
  getVIDEOFile,
};
