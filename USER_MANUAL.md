# Screen Activity Analyzer - User Manual

## 📖 Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [User Registration & Login](#user-registration--login)
4. [Uploading Videos](#uploading-videos)
5. [Viewing Analysis Results](#viewing-analysis-results)
6. [Using the Telegram Bot](#using-the-telegram-bot)
7. [Understanding AI Predictions](#understanding-ai-predictions)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## 📋 Overview

**Screen Activity Analyzer** is an AI-powered application that analyzes screen recording videos to detect:

- Which applications are being used
- What actions are being performed
- Timestamped activity timeline

### Key Features

✅ **Web-based Interface** - Upload and analyze videos through a user-friendly dashboard  
✅ **Telegram Bot Integration** - Upload videos directly via Telegram  
✅ **AI-Powered Analysis** - Automatic detection of apps and actions  
✅ **Interactive Timeline** - Click timestamps to jump to specific moments  
✅ **Real-time Processing** - Track video processing status live  
✅ **Secure Storage** - Videos stored securely in MinIO object storage

---

## 🚀 Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Telegram account (optional, for bot usage)

### Accessing the Application

**Web Interface:**

- URL: `http://localhost:5173` (or your deployed URL)
- Supported formats: MP4 videos
- Recommended video length: 1-30 minutes

**Telegram Bot:**

- Search for your bot in Telegram
- Send `/start` to begin
- File size limit: 50MB

---

## 👤 User Registration & Login

### Creating an Account

1. **Navigate to Sign Up Page**
   - Click "Sign Up" button on the homepage
2. **Enter Your Information**

   - Full Name
   - Email Address
   - Password (minimum 8 characters)
   - Confirm Password

3. **Submit Registration**
   - Click "Create Account"
   - You'll be automatically logged in

### Logging In

1. **Go to Login Page**
   - Click "Login" button
2. **Enter Credentials**

   - Email Address
   - Password

3. **Access Dashboard**
   - Click "Login"
   - You'll be redirected to the video dashboard

### Logging Out

- Click your profile icon in the navigation bar
- Select "Logout"

---

## 📤 Uploading Videos

### Method 1: Web Interface

1. **Access Dashboard**

   - Login to your account
   - Navigate to "Videos" page

2. **Upload Video**

   - Click "Upload New Video" button
   - Select your MP4 file from your computer
   - Click "Open" or "Upload"

3. **Confirmation**

   - You'll see a success message: "Video uploaded. Processing started."
   - Video will appear in your video list with "Processing" status

4. **Wait for Processing**
   - The page auto-refreshes every 5 seconds
   - Processing time: 5-15 minutes (depends on video length)
   - Status will change to "Completed" when ready

### Method 2: Telegram Bot

1. **Start the Bot**

   - Open Telegram
   - Search for your bot (e.g., `@your_video_analysis_bot`)
   - Send `/start` command

2. **Send Video**

   - Click attachment icon (📎)
   - Select "File" or "Gallery"
   - Choose your MP4 video (max 50MB)
   - Send to the bot

3. **Receive Confirmation**

   - Bot will confirm: "📥 Downloading your video..."
   - Then: "✅ Video uploaded successfully!"
   - Processing notification with estimated time

4. **Get Results**
   - Bot will notify you when processing completes
   - Receive summary with first 10 activities
   - Get link to view full results on web

### Supported Video Formats

- **Format:** MP4 only
- **Resolution:** Any (recommended: 720p or higher)
- **Duration:** 1 second to 2 hours
- **File Size:**
  - Web: Up to 500MB
  - Telegram: Up to 50MB

---

## 🔍 Viewing Analysis Results

### Video Dashboard

1. **Access Your Videos**

   - Login to web interface
   - Navigate to "Videos" page
   - See all your uploaded videos

2. **Video List Shows:**
   - Video thumbnail
   - Upload date/time
   - Processing status (Processing/Completed/Failed)
   - Duration
   - Actions (View Details, Delete)

### Viewing Detailed Analysis

1. **Open Video Details**

   - Click on any completed video
   - Or click "View Details" button

2. **Video Player**

   - Watch your screen recording
   - Standard video controls (play, pause, seek)
   - Volume control

3. **Activity Timeline Table**

   - **Timestamp Column:** Time range (e.g., "0s-3s", "3s-6s")
   - **Application Column:** Detected app name with confidence percentage
   - **Action Column:** Detected action with confidence percentage

4. **Interactive Timeline**
   - Click any timestamp row
   - Video automatically seeks to that time
   - Video auto-plays from selected timestamp
   - Perfect for reviewing specific activities

### Example Timeline

| Time Range | Application      | Action                      |
| ---------- | ---------------- | --------------------------- |
| 0s-3s      | editor (23.8%)   | app:switch (50.5%)          |
| 3s-6s      | browser (45.2%)  | browser:explore_url (72.3%) |
| 6s-9s      | notepad (67.1%)  | text:type (85.2%)           |
| 9s-12s     | terminal (72.5%) | code:execute (78.9%)        |

---

## 🤖 Using the Telegram Bot

### Setup (First Time)

1. **Find the Bot**

   - Open Telegram app
   - Search for your bot username
   - Example: `@my_video_analysis_bot`

2. **Start Conversation**
   - Click "Start" or send `/start`
   - Bot sends welcome message

### Bot Commands

#### `/start`

- **Purpose:** Initialize bot and get welcome message
- **Response:** Instructions on how to use the bot

#### `/help`

- **Purpose:** Get help and usage instructions
- **Response:** Step-by-step guide
  ```
  How to use:
  1. Send MP4 video file
  2. Wait for processing notification
  3. Get results directly in chat
  ```

#### `/status`

- **Purpose:** Check if you have a video currently processing
- **Response:**
  - If processing: "⏳ Processing... Video ID: xxx"
  - If idle: "✅ No active processing. Upload new video!"

### Uploading via Telegram

1. **Send Video File**

   - Click attachment icon (📎)
   - Select your video file
   - Send to bot

2. **Receive Updates**

   ```
   📥 Downloading your video...
   ✅ Video uploaded successfully!
   Video ID: 6999c2c4a4ae57f089525d19
   Processing has started...
   ⏱️ Estimated time: 5-15 minutes
   ```

3. **Get Results**

   ```
   ✅ Video Analysis Complete!

   📹 Video Information
   Duration: 19m 48s
   Total Chunks: 397

   📊 Summary
   Most Common App: notepad
   Most Common Action: browser:explore_url
   Avg App Confidence: 49.5%
   Avg Action Confidence: 61.7%

   🎯 First 10 Activities
   [List of first 10 detected activities]

   💡 View full results at: http://localhost:5173/videos
   ```

### Tips for Telegram Usage

- ✅ One video at a time per user
- ✅ Check `/status` before uploading another
- ✅ Videos under 50MB work best
- ✅ Bot works 24/7 - upload anytime
- ✅ No login required for Telegram

---

## 🧠 Understanding AI Predictions

### What the AI Detects

#### Applications

The AI identifies which application is active in the video:

- `browser` - Web browser (Chrome, Firefox, Edge)
- `editor` - Text/Code editors (VS Code, Notepad++)
- `notepad` - Windows Notepad
- `terminal` - Command line/terminal
- `file_explorer` - File manager
- `media_player` - Video/audio player
- And more...

#### Actions

The AI detects what action is being performed:

- `app:switch` - Switching between applications
- `browser:explore_url` - Browsing/navigating websites
- `text:type` - Typing text
- `code:execute` - Running code/commands
- `file:open` - Opening files
- `video:play` - Playing videos
- `scroll` - Scrolling content
- And more...

### Confidence Scores

Each prediction includes a confidence percentage:

- **High Confidence (70-100%)**

  - Very reliable prediction
  - Example: `notepad (87.5%)`

- **Medium Confidence (40-70%)**

  - Likely correct, some uncertainty
  - Example: `browser (55.3%)`

- **Low Confidence (0-40%)**
  - Uncertain prediction, review manually
  - Example: `editor (25.1%)`

### Time Chunks

- Videos are analyzed in **3-second chunks**
- Each row in the timeline = 3 seconds of video
- Example: "0s-3s", "3s-6s", "6s-9s"

---

## 🔧 Troubleshooting

### Common Issues

#### ❌ "Video upload failed"

**Possible Causes:**

- File is not MP4 format
- File is corrupted
- Internet connection lost
- Server is down

**Solutions:**

1. Check file format (must be .mp4)
2. Try re-exporting video as MP4
3. Check internet connection
4. Try uploading smaller file first
5. Contact support if issue persists

#### ❌ "Processing stuck"

**Symptoms:**

- Video status shows "Processing" for over 30 minutes
- No updates received

**Solutions:**

1. Refresh the page (web interface)
2. Check `/status` (Telegram bot)
3. Wait a bit longer (very long videos take time)
4. Contact administrator if truly stuck

#### ❌ "Video file is too large" (Telegram)

**Solution:**

- Use web interface for files > 50MB
- Or compress video to under 50MB
- Reduce video resolution (720p recommended)

#### ❌ "Failed to fetch predictions"

**Solution:**

1. Check if AI prediction service is running
2. Refresh the browser
3. Try re-processing the video
4. Contact administrator

#### ❌ "Login failed"

**Solutions:**

1. Verify email and password are correct
2. Check if account was created successfully
3. Reset password if forgotten
4. Clear browser cache and cookies

### Performance Tips

✅ **Optimal Video Settings:**

- Resolution: 720p (1280x720)
- Frame rate: 30fps
- Bitrate: 2-5 Mbps
- Duration: 5-20 minutes

✅ **Best Practices:**

- Upload during off-peak hours
- Use stable internet connection
- Don't close browser during upload
- Keep one video processing at a time

---

## ❓ FAQ

### General Questions

**Q: Is my video data secure?**  
A: Yes, all videos are stored securely in MinIO object storage with access controls. Only you can access your videos.

**Q: How long are videos stored?**  
A: Videos are stored indefinitely until you delete them manually.

**Q: Can I delete a video?**  
A: Yes, use the "Delete" button on the video dashboard.

**Q: What video format is supported?**  
A: Currently, only MP4 format is supported.

**Q: How accurate is the AI?**  
A: Accuracy varies by video quality. Typical accuracy: 60-80%. Check confidence scores for reliability.

### Processing Questions

**Q: How long does processing take?**  
A: Typically 5-15 minutes, depending on video length. Longer videos take proportionally longer.

**Q: Can I upload multiple videos at once?**  
A: Yes on web interface. Telegram bot: one video per user at a time.

**Q: What happens if processing fails?**  
A: The system retries up to 3 times. If all retries fail, video status shows "Failed" with error details.

**Q: Can I cancel processing?**  
A: Currently, processing cannot be cancelled once started.

### Telegram Bot Questions

**Q: Do I need to login to use the Telegram bot?**  
A: No, the bot works without web authentication. Just start the bot and send videos.

**Q: Can I access Telegram-uploaded videos on the web?**  
A: Yes, they appear in the general video list on the web interface.

**Q: Why is there a 50MB limit on Telegram?**  
A: This is a Telegram API limitation. Use the web interface for larger files.

**Q: Can multiple users use the same bot?**  
A: Yes, the bot handles multiple users simultaneously. Each user's processing is tracked separately.

### Technical Questions

**Q: What technology powers the AI?**  
A: The system uses a custom-trained AI model for screen activity recognition, processed in 3-second chunks.

**Q: Can I integrate this with my own application?**  
A: Contact the administrator for API access and integration documentation.

**Q: Is there a mobile app?**  
A: Currently web and Telegram only. Mobile browser works for web interface.

**Q: What browsers are supported?**  
A: All modern browsers: Chrome, Firefox, Safari, Edge (latest versions).

---

## 📞 Support & Contact

### Getting Help

1. **Check this manual first** - Most questions are answered here
2. **Review error messages** - They often contain helpful information
3. **Try troubleshooting steps** - Listed in Troubleshooting section
4. **Contact administrator** - If issue persists

### Reporting Issues

When reporting problems, please include:

- What you were trying to do
- Error message (if any)
- Video ID (if applicable)
- Screenshots (if helpful)
- Browser/device information

---

## 🎯 Quick Start Guide

**New User? Follow These Steps:**

1. ✅ Create account on web interface
2. ✅ Upload a short test video (1-2 minutes)
3. ✅ Wait for processing to complete
4. ✅ Review the analysis results
5. ✅ Click timestamps to navigate video
6. ✅ (Optional) Set up Telegram bot for mobile uploads

**That's it! You're ready to analyze your screen recordings.**

---

## 📝 Tips for Best Results

### Recording Tips

1. **High Contrast** - Use themes with clear visual differences
2. **Steady Camera** - Avoid shaky recordings if using external camera
3. **Clear Actions** - Make deliberate, clear actions
4. **Good Lighting** - Ensure screen is clearly visible
5. **Minimize Distractions** - Close unnecessary windows

### Upload Tips

1. **Start Small** - Test with short videos first
2. **Check Format** - Always use MP4
3. **Stable Connection** - Upload on reliable internet
4. **One at a Time** - Don't overload with simultaneous uploads
5. **Name Clearly** - Use descriptive filenames

### Analysis Tips

1. **Check Confidence** - Focus on high-confidence predictions
2. **Review Manually** - Verify low-confidence detections
3. **Use Timestamps** - Jump to specific moments for verification
4. **Compare Results** - Test with different video qualities
5. **Provide Feedback** - Report incorrect predictions to improve AI

---

**Version:** 1.0.0  
**Last Updated:** February 25, 2026  
**Application:** Screen Activity Analyzer

---

_Made with ❤️ for efficient screen activity analysis_
