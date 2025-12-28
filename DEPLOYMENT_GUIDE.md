# 🚀 Deployment Guide - GitHub & Vercel

## Overview
This guide will help you deploy the MOPONS project to GitHub and Vercel.

---

## 📋 Prerequisites

Before starting, make sure you have:
- [ ] GitHub account (create at https://github.com/signup)
- [ ] Vercel account (create at https://vercel.com/signup)
- [ ] Git installed on your computer
- [ ] MongoDB Atlas account for production database

---

## Part 1: Upload to GitHub

### Step 1: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit - MOPONS coupon marketplace"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `mopons` (or your preferred name)
3. Description: "MOPONS - A marketplace for buying, selling, and exchanging coupons"
4. Keep it **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 3: Push to GitHub

After creating the repository, run these commands:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/mopons.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Part 2: Deploy to Vercel

### Important Note:
Vercel is best for frontend apps. For this full-stack MERN app, we'll use:
- **Vercel** for the React frontend
- **Railway/Render** for the Node.js backend (recommended)

### Option A: Deploy Frontend Only to Vercel

#### Step 1: Prepare Frontend for Deployment

The frontend needs to be configured separately. We'll create a `vercel.json` in the client folder.

#### Step 2: Deploy Frontend

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add Environment Variables:
   - `REACT_APP_API_URL`: Your backend URL (see Option B)
5. Click "Deploy"

### Option B: Deploy Backend (Recommended Platforms)

#### Option B1: Railway (Easiest)

1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `/` (root)
6. Add these environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=production
   PORT=5000
   ```
7. Railway will auto-deploy!

#### Option B2: Render (Free tier available)

1. Go to https://render.com/
2. Sign up with GitHub
3. New → Web Service
4. Connect your repository
5. Configure:
   - **Name**: mopons-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables (same as above)
7. Click "Create Web Service"

#### Option B3: Vercel Serverless (Advanced)

You can also deploy the backend to Vercel, but it requires converting to serverless functions.

---

## Part 3: MongoDB Atlas Setup

### Step 1: Create Database

1. Go to https://cloud.mongodb.com/
2. Create a free cluster
3. Set up database access (username/password)
4. Add your IP to whitelist (or use 0.0.0.0/0 for all IPs)

### Step 2: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Add this to your backend environment variables as `MONGODB_URI`

---

## Part 4: Environment Variables

### Backend (.env for production)

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_key_here
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-vercel-url.vercel.app
```

### Frontend (in Vercel)

```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

---

## Part 5: Update CORS Settings

In `server.js`, update CORS to allow your frontend URL:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## Quick Start Commands

### Initialize and Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mopons.git
git push -u origin main
```

### After making changes:
```bash
git add .
git commit -m "Your commit message"
git push
```

---

## Recommended Deployment Architecture

```
┌─────────────────────────────────────┐
│   Frontend (Vercel)                 │
│   https://mopons.vercel.app         │
└──────────────┬──────────────────────┘
               │
               ↓ API Calls
┌──────────────────────────────────────┐
│   Backend (Railway/Render)           │
│   https://mopons-api.railway.app     │
└──────────────┬───────────────────────┘
               │
               ↓ Database
┌──────────────────────────────────────┐
│   MongoDB Atlas (Cloud)              │
└──────────────────────────────────────┘
```

---

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] MongoDB Atlas database connected
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Test login/signup functionality
- [ ] Test coupon listing
- [ ] Test OCR feature
- [ ] Test wallet functionality

---

## Troubleshooting

### Issue: CORS errors
**Solution**: Make sure `FRONTEND_URL` is set in backend env vars

### Issue: Database connection failed
**Solution**: Check MongoDB Atlas IP whitelist and connection string

### Issue: OCR not working
**Solution**: Tesseract.js should work on Vercel/Railway. Check logs.

### Issue: Build failed
**Solution**: Check build logs, ensure all dependencies are in package.json

---

## Support

Need help? Check:
- Railway docs: https://docs.railway.app/
- Vercel docs: https://vercel.com/docs
- MongoDB Atlas docs: https://docs.atlas.mongodb.com/

---

**You're ready to deploy! 🚀**
