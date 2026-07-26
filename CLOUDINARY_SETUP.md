# Cloudinary Setup Guide

The image upload functionality now uses Cloudinary for reliable, persistent image storage that works in both development and production.

## Why Cloudinary?

- **Free tier available** (up to 25GB storage)
- **Automatic image optimization** (reduces file sizes)
- **CDN delivery** (fast image loading worldwide)
- **Persistent storage** (images won't disappear on server restart)
- **Works on Render's free tier** (no file system limitations)

## Setup Steps:

### 1. Create a Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Cloudinary Credentials

1. After logging in, go to the Dashboard
2. Copy these three values:
   - **Cloud Name** (top of the dashboard)
   - **API Key** (in the Account Details section)
   - **API Secret** (in the Account Details section)

### 3. Update Local Environment Variables

Edit `backend/.env` file and add your Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### 4. Update Render Environment Variables

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" section
4. Add these environment variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret

### 5. Restart Services

**Local Development:**
```bash
# Stop the current backend server (Ctrl+C)
# Restart backend
cd backend
npm start
```

**Production (Render):**
- The changes will auto-deploy when you push the code
- Or manually restart from Render dashboard

## Test the Setup

1. Start your local backend with the new Cloudinary configuration
2. Upload an image from the dashboard
3. The image should now:
   - Be stored in Cloudinary
   - Display correctly in preview
   - Show on shop page
   - Appear in product edit form
   - Work in production on GitHub Pages

## Benefits

- ✅ Images persist across server restarts
- ✅ Works on Render's free tier
- ✅ Automatic image optimization
- ✅ Fast CDN delivery
- ✅ Consistent behavior in development and production
- ✅ No local file storage issues

## Troubleshooting

**Images still not showing:**
- Check that Cloudinary credentials are correct
- Verify your Cloudinary account is active
- Check browser console for errors
- Ensure backend server is running with new configuration

**Upload errors:**
- Verify API key and secret are correct
- Check Cloudinary account limits (free tier has limits)
- Ensure file size is under 10MB

**Images not accessible:**
- Cloudinary URLs are public by default
- Check your Cloudinary delivery settings
- Verify network connectivity
