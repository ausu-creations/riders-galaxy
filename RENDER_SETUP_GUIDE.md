# Render Backend Setup Guide

## 🚀 Step-by-Step Render Deployment

### Step 1: Create a Procfile (Already Done ✅)
I've already created the `backend/Procfile` file with:
```
web: node server.js
```

### Step 2: Push Changes to GitHub
First, commit and push the new Procfile to your GitHub repository:

```bash
cd C:\Users\AuSu\Documents\GitHub\riders-galaxy
git add backend/Procfile
git commit -m "Add Procfile for Render deployment"
git push origin main
```

### Step 3: Go to Render Dashboard
1. Go to [render.com](https://render.com)
2. Log in with your GitHub account
3. You should see your dashboard

### Step 4: Create New Web Service
1. Click the **"New +"** button in the top right
2. Select **"Web Service"**

### Step 5: Connect Your Repository
1. You'll see a list of your GitHub repositories
2. Find and select **"riders-galaxy"** (or your repo name)
3. Click **"Connect"**

### Step 6: Configure the Web Service

#### **Name & Region:**
- **Name**: `riders-galaxy-backend` (or any name you prefer)
- **Region**: Choose the closest region to you (e.g., Singapore for India)

#### **Branch:**
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` (IMPORTANT: Type "backend" here)

#### **Build & Deploy:**
- **Runtime**: **Node** (select from dropdown)
- **Build Command**: `npm install`
- **Start Command**: `node server.js`

#### **Advanced Settings:**
- Skip the advanced settings for now

### Step 7: Add Environment Variables

Scroll down to **"Environment Variables"** section and add these:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://abhishek251gupta_db_user:Codywinscrown19@ac-m3tmsx0-shard-00-00.vgx49k1.mongodb.net:27017,ac-m3tmsx0-shard-00-01.vgx49k1.mongodb.net:27017,ac-m3tmsx0-shard-00-02.vgx49k1.mongodb.net:27017/?ssl=true&replicaSet=atlas-77fwnx-shard-0&authSource=admin&appName=Riders-Galaxy

# JWT Secret
JWT_SECRET=riders-galaxy-super-secret-jwt-key-2024

# Razorpay Configuration (Add when available)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Admin Credentials
ADMIN_EMAIL=admin@ridersgalaxy.com
ADMIN_PASSWORD=admin123

# Server Configuration
PORT=5000
NODE_ENV=production
```

**To add each variable:**
1. Click **"Add Environment Variable"**
2. **Key**: Copy the variable name (e.g., `MONGODB_URI`)
3. **Value**: Copy the value
4. Click **"Save"**

### Step 8: Deploy
1. Click the **"Create Web Service"** button at the bottom
2. Render will start deploying your backend
3. You'll see a deployment log with progress

### Step 9: Wait for Deployment
- Deployment usually takes 2-5 minutes
- You'll see **"Deploy in progress"** 
- When it's done, it will show **"Deploy succeeded"**

### Step 10: Get Your Backend URL
Once deployed, you'll see a URL like:
```
https://riders-galaxy-backend.onrender.com
```

Copy this URL - you'll need it for the frontend.

### Step 11: Create Admin User
After deployment, you need to create the admin user:

1. Click on your web service in Render
2. Click **"Shell"** tab (or use the manual deploy method)
3. In the shell, run:
```bash
cd /opt/render/project/backend
node scripts/seedAdmin.js
```

**Alternative Method:**
If shell doesn't work, you can:
1. Go to your deployed backend URL + `/api/health`
2. Check if backend is running
3. Then manually create admin via API or use a seed script

### Step 12: Update Frontend API URL
Update your frontend to use the new backend URL:

**Option 1: Update GitHub Pages Environment:**
1. Go to your GitHub repository
2. Settings → Pages → Build and deployment → Environment
3. Add `VITE_API_URL=https://riders-galaxy-backend.onrender.com/api`
4. Rebuild frontend: `cd frontend && npm run deploy`

**Option 2: Update local and redeploy:**
1. Edit `frontend/.env.production`:
```env
VITE_API_URL=https://riders-galaxy-backend.onrender.com/api
```
2. Rebuild and deploy: `cd frontend && npm run deploy`

## 🔍 Troubleshooting

### **Deployment Fails:**
- Check the deployment logs in Render
- Make sure `Root Directory` is set to `backend`
- Verify all environment variables are set
- Check MongoDB connection string is correct

### **Backend Not Responding:**
- Wait a few minutes after deployment (cold start)
- Check if MongoDB Atlas is accessible
- Verify PORT is set to 5000
- Check Render logs for errors

### **MongoDB Connection Issues:**
- Verify your MongoDB Atlas cluster is running
- Check IP whitelist in MongoDB Atlas
- Ensure connection string is correct
- Check network connectivity

### **Admin User Not Created:**
- Try running seed script via Render Shell
- Check if MongoDB connection is working
- Verify environment variables are set correctly

## 🎯 Quick Checklist

Before clicking "Create Web Service":

- [ ] ✅ Procfile created in backend folder
- [ ] ✅ Changes pushed to GitHub
- [ ] ✅ Root Directory set to "backend"
- [ ] ✅ Runtime set to "Node"
- [ ] ✅ Build Command: `npm install`
- [ ] ✅ Start Command: `node server.js`
- [ ] ✅ All environment variables added
- [ ] ✅ MongoDB connection string verified

## 📞 What You'll Get

After successful deployment:
- **Backend URL**: `https://riders-galaxy-backend.onrender.com`
- **API Endpoints**: `https://riders-galaxy-backend.onrender.com/api/*`
- **Health Check**: `https://riders-galaxy-backend.onrender.com/api/health`
- **Free tier**: Always running (with occasional cold starts)

## 🚀 Next Steps After Deployment

1. **Test the backend**: Visit `https://riders-galaxy-backend.onrender.com/api/health`
2. **Create admin user**: Run seed script
3. **Update frontend**: Change API URL to Render URL
4. **Test full integration**: Try login, orders, etc.
5. **Monitor**: Check Render dashboard for logs and status

Your backend will be live and accessible from your GitHub Pages frontend!