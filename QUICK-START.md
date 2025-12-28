# 🚀 MOPONS - Quick Start Guide

## Prerequisites Checklist

Before running MOPONS, ensure you have:

- [ ] Node.js 18+ installed
- [ ] MongoDB installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

---

## 🔧 Step-by-Step Setup

### Step 1: Install MongoDB

**Option A: Local MongoDB (Recommended for Development)**

**Windows:**
1. Download MongoDB Community Server from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will run as a Windows service automatically

**To verify MongoDB is running:**
```bash
# Open Command Prompt
mongosh
# or
mongo
```

**Option B: MongoDB Atlas (Cloud - Free Tier)**

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create a cluster (free M0 tier)
4. Get connection string
5. Update `.env` file with Atlas connection string

---

### Step 2: Clone and Setup Backend

```bash
# Navigate to project
cd d:\test antigravity\mopons

# Install dependencies (already done)
npm install

# Create .env file
# Copy from .env.example and update values
```

**Minimum .env configuration:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mopons
JWT_SECRET=mopons_secret_key_2024
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

**Optional (for full features):**
```env
# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Gmail (for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

### Step 3: Seed Database

```bash
# Seed categories
npm run seed
```

You should see: `✅ Categories seeded successfully`

---

### Step 4: Start Backend Server

```bash
# Development mode with auto-reload
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 MOPONS Backend Server                                ║
║                                                           ║
║   📡 Server running on port 5000                          ║
║   🌍 Environment: development                             ║
║   🔗 API URL: http://localhost:5000/api                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

### Step 5: Test Backend API

**Open new terminal and test:**

```bash
# Health check
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "MOPONS API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Step 6: Start Frontend

```bash
# Open new terminal
cd d:\test antigravity\mopons\client

# Start React app
npm start
```

Browser will automatically open at `http://localhost:3000`

---

## 🧪 Testing the Application

### Test 1: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

### Test 2: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

Copy the token from response.

### Test 3: Get Categories

```bash
# This will work once you seed the database
curl http://localhost:5000/api/categories
```

### Test 4: Add Money to Wallet

```bash
curl -X POST http://localhost:5000/api/wallet/add-money \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"amount\":1000}"
```

---

## 🐛 Troubleshooting

### Issue: "MongoServerError: connect ECONNREFUSED"

**Solution:** MongoDB is not running

**Windows:**
```bash
# Check if MongoDB service is running
net start MongoDB

# If not started, start it
net start MongoDB
```

**Alternative:** Use MongoDB Atlas (cloud) instead

---

### Issue: "Port 5000 already in use"

**Solution:** Change port in `.env`

```env
PORT=5001
```

---

### Issue: "Cannot find module"

**Solution:** Reinstall dependencies

```bash
rm -rf node_modules
npm install
```

---

### Issue: Email not sending

**Solution:** This is normal if you haven't configured SMTP

- App will work without email
- To enable emails, configure Gmail SMTP in `.env`
- Generate App Password from Google Account settings

---

### Issue: Image upload failing

**Solution:** This is normal if you haven't configured Cloudinary

- Configure Cloudinary account (free tier available)
- Update `.env` with credentials
- Or modify code to use local storage

---

## 📱 Accessing the Application

### Frontend (React)
```
http://localhost:3000
```

### Backend API
```
http://localhost:5000/api
```

### API Health Check
```
http://localhost:5000/api/health
```

---

## 🎯 Quick Demo Flow

1. **Open Frontend** → `http://localhost:3000`
2. **View Landing Page** → See all features
3. **Register Account** → Use Postman or curl
4. **Login** → Get JWT token
5. **Add Money to Wallet** → Test wallet system
6. **Create Coupon** → Upload coupon (needs Cloudinary)
7. **Browse Coupons** → View marketplace
8. **Buy Coupon** → Test purchase flow

---

## 📊 Database Verification

### Using MongoDB Compass

1. Download MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `mopons` database
4. Verify collections:
   - categories (should have 8 items)
   - users
   - coupons
   - transactions
   - etc.

### Using Command Line

```bash
mongosh

use mopons

# Show all collections
show collections

# Count categories
db.categories.countDocuments()

# View categories
db.categories.find().pretty()
```

---

## 🔑 Default Admin Account

To create an admin account, register normally then update in MongoDB:

```javascript
// In mongosh
use mopons

db.users.updateOne(
  { email: "admin@mopons.com" },
  { $set: { role: "admin" } }
)
```

---

## 📝 Development Workflow

1. **Backend Changes:**
   - Edit files in `mopons/` directory
   - Server auto-reloads (nodemon)
   - Test with Postman/curl

2. **Frontend Changes:**
   - Edit files in `mopons/client/src/`
   - React auto-reloads
   - View in browser

3. **Database Changes:**
   - Update models in `models/` directory
   - Restart server
   - Test with MongoDB Compass

---

## 🎓 For Project Submission

### Required Files:
1. Source code (backend + frontend)
2. README.md
3. PROJECT-DOCUMENTATION.md
4. Database schema diagram
5. API documentation
6. Screenshots
7. Video demonstration
8. Blackbook with all documentation

### Blackbook Sections:
1. Abstract
2. Introduction
3. Literature Survey
4. System Analysis
5. System Design (ERD, DFD, Use Cases)
6. Implementation (Code snippets)
7. Testing (Test cases)
8. Screenshots
9. Conclusion
10. References

---

## 🚀 Deployment (Optional)

### Backend → Railway/Heroku
### Frontend → Vercel/Netlify
### Database → MongoDB Atlas

---

## 📞 Need Help?

Common commands:

```bash
# Backend
npm run dev          # Start backend
npm run seed         # Seed database
npm start            # Production mode

# Frontend
cd client
npm start            # Start React app
npm run build        # Build for production
```

---

**Happy Coding! 🎉**

Target: 400/400 Marks 🎯
