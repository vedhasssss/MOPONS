# 💰 MOPONS - Project Setup & Requirements

Welcome to the **MOPONS** project! This guide will help you set up your environment to run the application successfully.

---

## 💻 System Requirements

Before running the project, ensure your computer meets the following requirements:

### 1. Operating System
- **Windows** (10 or 11)
- **macOS** (Latest versions)
- **Linux** (Ubuntu, Debian, etc.)

### 2. Required Software (Must Install)

You **MUST** have these installed on your system:

#### ✅ Node.js & npm
- **Required Version**: Node.js v14.0.0 or higher (LTS recommended).
- **Check if installed**: Open terminal/command prompt and run:
  ```bash
  node -v
  npm -v
  ```
- **Download**: [nodejs.org](https://nodejs.org/)

#### ✅ MongoDB (Database)
- **Required**: MongoDB Community Server (running locally).
- **Check if installed**:
  ```bash
  mongod --version
  ```
- **Download**: [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- **Important**: Make sure the MongoDB service is **running** in the background.

#### ✅ Git (Optional but Recommended)
- Useful for version control and cloning the repo.
- **Download**: [git-scm.com](https://git-scm.com/)

---

## 🛠️ Installation & Setup

Once you have the requirements installed, follow these steps:

### Option 1: Automatic Setup (Windows Only) 🚀
We have created a script to automate everything for you!

1. **Unzip** the project folder.
2. Double-click the **`install-and-run.bat`** file.
3. The script will:
   - Install all dependencies (Backend & Frontend).
   - Seed the database with initial categories.
   - Start the Backend Server.
   - Start the Frontend React App.

### Option 2: Manual Setup (Mac/Linux/Windows) ⚙️

If you prefer to run commands manually:

**1. Setup Backend**
```bash
# Go to project root
cd mopons

# Install dependencies
npm install

# Seed Database
npm run seed

# Start Server
npm run dev
```

**2. Setup Frontend**
```bash
# Open a new terminal
cd mopons/client

# Install dependencies
npm install

# Start React App
npm start
```

---

## 🔑 Environment Configuration

The project uses a `.env` file for configuration. Ensure this file exists in the root directory with the following keys (ask the project lead for the values):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mopons
JWT_SECRET=your_jwt_secret
...
```

---

## 🌐 Accessing the App

Once running:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🐛 Troubleshooting

- **"MongoNetworkError"**: Make sure MongoDB is installed and the service is running.
- **"Node is not recognized"**: Install Node.js and restart your computer.
- **"npm start fails"**: Delete `node_modules` and run `npm install` again.

---

## 🚀 Deployment

Ready to deploy your app? We support multiple deployment options:

### Quick Deploy:
- **GitHub**: See `DEPLOYMENT_GUIDE.md` for step-by-step instructions
- **Frontend**: Deploy to Vercel (recommended)
- **Backend**: Deploy to Railway or Render (recommended)

### Automated GitHub Upload:
Run the PowerShell script for quick GitHub upload:
```powershell
.\upload-to-github.ps1
```

### Manual Steps:
1. **Upload to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/mopons.git
   git push -u origin main
   ```

2. **Deploy Frontend** (Vercel):
   - Sign up at https://vercel.com
   - Import your GitHub repository
   - Set root directory to `client`
   - Deploy!

3. **Deploy Backend** (Railway):
   - Sign up at https://railway.app
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

📖 **Full deployment guide**: See `DEPLOYMENT_GUIDE.md`

---

## 📚 Documentation

- **API Testing**: `API-TESTING-GUIDE.md`
- **OCR Feature**: `OCR_FEATURE.md`
- **Deployment**: `DEPLOYMENT_GUIDE.md`
- **Quick Start**: `QUICK-START.md`
- **Working Features**: `WORKING-FEATURES.md`

Happy Coding! 🚀
