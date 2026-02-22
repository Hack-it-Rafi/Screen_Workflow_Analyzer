/* eslint-disable @typescript-eslint/no-explicit-any */
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { VIDEOServices } from '../Video/Video.service';
import { uploadToMinIO } from '../Video/Video.utility';
import config from '../../config';

const bucketName = 'video-files';

// Initialize bot
const bot = new Telegraf(config.telegram_bot_token as string);

// Store user video processing status
const userProcessing = new Map<number, string>();

// Helper function to format prediction results
const formatPredictionResults = (prediction: any): string => {
  try {
    const data = JSON.parse(prediction);

    if (data.error) {
      return `❌ *Processing Failed*\n\n${data.error}`;
    }

    const { summary, video_info, predictions } = data;

    let message = '✅ *Video Analysis Complete!*\n\n';

    // Video Info
    if (video_info) {
      message += `📹 *Video Information*\n`;
      message += `Duration: ${Math.floor(video_info.duration_seconds / 60)}m ${Math.floor(video_info.duration_seconds % 60)}s\n`;
      message += `Total Chunks: ${video_info.num_chunks}\n\n`;
    }

    // Summary
    if (summary) {
      message += `📊 *Summary*\n`;
      message += `Most Common App: \`${summary.most_common_app}\`\n`;
      message += `Most Common Action: \`${summary.most_common_action}\`\n`;
      message += `Avg App Confidence: ${(summary.average_app_confidence * 100).toFixed(1)}%\n`;
      message += `Avg Action Confidence: ${(summary.average_action_confidence * 100).toFixed(1)}%\n\n`;
    }

    // Top 10 predictions
    if (predictions && predictions.length > 0) {
      message += `🎯 *First 10 Activities*\n\n`;
      predictions.slice(0, 10).forEach((pred: any, idx: number) => {
        message += `${idx + 1}. ${pred.time_range}\n`;
        message += `   App: \`${pred.app}\` (${(pred.app_confidence * 100).toFixed(1)}%)\n`;
        message += `   Action: \`${pred.action}\` (${(pred.action_confidence * 100).toFixed(1)}%)\n\n`;
      });

      if (predictions.length > 10) {
        message += `... and ${predictions.length - 10} more activities\n\n`;
      }
    }

    message += `\n💡 View full results at: ${config.frontend_url}/videos`;

    return message;
  } catch (error) {
    return `❌ Error formatting results: ${error}`;
  }
};

// Background function to process prediction
const processPredictionInBackground = async (
  videoId: string,
  tempFilePath: string,
  originalname: string,
  fileSize: number,
  chatId: number,
) => {
  try {
    bot.telegram.sendMessage(
      chatId,
      '🎬 *Processing your video...*\n\nThis may take several minutes depending on the video length.',
      { parse_mode: 'Markdown' },
    );

    const formData = new FormData();
    formData.append('video', fs.createReadStream(tempFilePath), {
      filename: originalname,
      contentType: 'video/mp4',
    });

    const timeout = Math.min(
      600000 + Math.floor(fileSize / (1024 * 1024) / 50) * 300000,
      1800000,
    );

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

    await VIDEOServices.updateVIDEOInDB(videoId, {
      prediction: JSON.stringify(prediction),
      status: 'completed',
    });

    // Send results to user
    const resultMessage = formatPredictionResults(JSON.stringify(prediction));
    await bot.telegram.sendMessage(chatId, resultMessage, {
      parse_mode: 'Markdown',
    });

    userProcessing.delete(chatId);
  } catch (error: unknown) {
    const axiosError = error as {
      code?: string;
      message?: string;
      response?: { data?: { message?: string } };
    };

    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      'Unknown error';

    await VIDEOServices.updateVIDEOInDB(videoId, {
      status: 'failed',
      prediction: JSON.stringify({
        error: errorMessage,
        errorCode: axiosError.code,
        timestamp: new Date().toISOString(),
      }),
    });

    await bot.telegram.sendMessage(
      chatId,
      `❌ *Processing Failed*\n\n${errorMessage}\n\nPlease try again with a shorter video or contact support.`,
      { parse_mode: 'Markdown' },
    );

    userProcessing.delete(chatId);
  } finally {
    if (fs.existsSync(tempFilePath)) {
      await fs.promises.unlink(tempFilePath);
    }
  }
};

// Start command
bot.command('start', (ctx) => {
  ctx.reply(
    '👋 *Welcome to Video Analysis Bot!*\n\n' +
      'I can analyze your screen recording videos and detect:\n' +
      '• Applications used\n' +
      '• Actions performed\n' +
      '• Activity timeline\n\n' +
      '📹 Simply send me a video file (MP4) to get started!\n\n' +
      '*Commands:*\n' +
      '/start - Show this message\n' +
      '/help - Get help\n' +
      '/status - Check processing status',
    { parse_mode: 'Markdown' },
  );
});

// Help command
bot.command('help', (ctx) => {
  ctx.reply(
    '❓ *How to use this bot:*\n\n' +
      '1. Send me an MP4 video file\n' +
      '2. Wait for processing (may take several minutes)\n' +
      '3. Receive detailed analysis results\n\n' +
      '⚠️ *Requirements:*\n' +
      '• Video must be in MP4 format\n' +
      '• Recommended: videos under 20 minutes\n' +
      '• Only one video at a time\n\n' +
      '*Need more help?* Contact support.',
    { parse_mode: 'Markdown' },
  );
});

// Status command
bot.command('status', (ctx) => {
  const chatId = ctx.chat.id;
  const videoId = userProcessing.get(chatId);

  if (videoId) {
    ctx.reply(
      '⏳ *Processing Status*\n\n' +
        `Video ID: \`${videoId}\`\n` +
        'Status: Processing...\n\n' +
        'You will be notified when analysis is complete.',
      { parse_mode: 'Markdown' },
    );
  } else {
    ctx.reply(
      '✅ *No Active Processing*\n\n' + 'You can upload a new video anytime!',
      { parse_mode: 'Markdown' },
    );
  }
});

// Handle video uploads
bot.on(message('video'), async (ctx) => {
  const chatId = ctx.chat.id;

  // Check if user already has a video processing
  if (userProcessing.has(chatId)) {
    return ctx.reply(
      '⏳ You already have a video being processed!\n\n' +
        'Please wait for it to complete before uploading another.',
      { parse_mode: 'Markdown' },
    );
  }

  const video = ctx.message.video;

  // Check file size (limit to 50MB for Telegram API)
  if (video.file_size && video.file_size > 100 * 1024 * 1024) {
    return ctx.reply(
      '❌ Video file is too large!\n\n' +
        'Maximum size: 100MB\n' +
        'Please compress your video or upload it through the web interface.',
      { parse_mode: 'Markdown' },
    );
  }

  await ctx.reply('📥 Downloading your video...');

  try {
    // Download video from Telegram
    const fileLink = await ctx.telegram.getFileLink(video.file_id);
    const response = await axios.get(fileLink.href, {
      responseType: 'arraybuffer',
    });
    const videoBuffer = Buffer.from(response.data);

    const tempFilePath = path.join(process.cwd(), `${Date.now()}_telegram.mp4`);
    await fs.promises.writeFile(tempFilePath, videoBuffer);

    // Upload to MinIO
    const file = {
      path: tempFilePath,
      originalname: `${Date.now()}_telegram_${chatId}.mp4`,
      buffer: videoBuffer,
      size: videoBuffer.length,
    };

    await uploadToMinIO(bucketName, file);
    const fileUrl = `/${bucketName}/${file.originalname}`;

    // Save to database
    const videoData = {
      caption: `Telegram Upload - Chat ${chatId}`,
      fileUrl,
      status: 'processing' as const,
      telegramChatId: chatId,
    };

    const result = await VIDEOServices.createVIDEOIntoDB(videoData);
    userProcessing.set(chatId, result._id.toString());

    await ctx.reply(
      '✅ *Video uploaded successfully!*\n\n' +
        `Video ID: \`${result._id}\`\n` +
        'Processing has started. You will be notified when analysis is complete.\n\n' +
        '⏱️ Estimated time: 5-15 minutes',
      { parse_mode: 'Markdown' },
    );

    // Start background processing
    processPredictionInBackground(
      result._id.toString(),
      tempFilePath,
      file.originalname,
      file.size,
      chatId,
    ).catch((err) => console.error('Background processing error:', err));
  } catch (error) {
    console.error('Error processing video:', error);
    ctx.reply(
      '❌ *Failed to process video*\n\n' +
        'An error occurred while uploading your video. Please try again.',
      { parse_mode: 'Markdown' },
    );
    userProcessing.delete(chatId);
  }
});

// Handle document uploads (in case video is sent as document)
bot.on(message('document'), async (ctx) => {
  const document = ctx.message.document;

  if (document.mime_type === 'video/mp4') {
    ctx.reply(
      '📹 Please send the video as a *video* (not as a document) for better compatibility.',
      { parse_mode: 'Markdown' },
    );
  } else {
    ctx.reply('❌ Only MP4 video files are supported.');
  }
});

// Handle other messages
bot.on(message('text'), (ctx) => {
  if (!ctx.message.text.startsWith('/')) {
    ctx.reply(
      '👋 Send me an MP4 video to analyze!\n\n' +
        'Use /help for more information.',
      { parse_mode: 'Markdown' },
    );
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Telegram bot error:', err);
  ctx.reply('❌ An error occurred. Please try again later.');
});

export default bot;
