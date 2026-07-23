# Render Fix - Wrong Start Command

## 🚨 The Problem
Render is trying to run: `npm server.js` (wrong)
It should run: `node server.js` (correct)

## 🔧 How to Fix This in Render Dashboard

### Step 1: Go to Your Web Service
1. Log in to Render
2. Click on your "riders-galaxy-backend" web service

### Step 2: Edit Settings
1. Click on the **"Settings"** tab
2. Scroll down to **"Build & Deploy"** section
3. Click **"Edit Build & Deploy"**

### Step 3: Fix the Start Command
Find the **"Start Command"** field and change it from:
```
npm server.js
```
To:
```
node server.js
```

### Step 4: Save and Redeploy
1. Click **"Save Changes"**
2. Render will automatically redeploy with the correct command
3. Wait for the new deployment to complete

## 🎯 Alternative Fix: Update package.json

If the above doesn't work, let's add a proper start script to package.json:

Current package.json has:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node scripts/seedAdmin.js"
}
```

The start script is correct, so the issue is definitely in the Render configuration.

## 📋 What Should Happen After Fix

After changing to `node server.js`, the deployment should:
1. Build successfully ✅
2. Start the server correctly ✅
3. Show "Deploy succeeded" ✅
4. Your backend will be live ✅

## 🔍 Verify Backend is Working

After successful deployment, visit:
```
https://riders-galaxy-backend.onrender.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Riders Galaxy API is running"
}
```

## 🚀 Next Steps After Fix

1. Fix the start command in Render
2. Wait for successful deployment
3. Test the health endpoint
4. Create admin user
5. Update frontend API URL
6. Test full integration