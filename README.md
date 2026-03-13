# 🎟️ MOPONS - Coupon Marketplace Platform

A modern coupon exchange and marketplace platform where users can buy, sell, and exchange digital coupons.

## ✨ Features

- 🛒 **Marketplace** - Browse and purchase coupons from other users
- 💰 **Digital Wallet** - Secure in-app wallet for transactions
- 🔐 **My Vault** - Manage purchased coupons and their codes
- 📊 **Dashboard** - Track spending, savings, and coupon statistics
- 🤖 **AI-Powered OCR** - Automatically extract coupon details from images
- 🔔 **Real-time Notifications** - Stay updated on transactions
- 🎨 **Modern UI** - Beautiful, responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gemini API Key (for AI features)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd mopons
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/mopons

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=http://localhost:3000

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Features
GEMINI_API_KEY=your_gemini_api_key
```

5. **Run the application**

```bash
# Development mode (runs both frontend and backend)
npm run dev all

# Or run separately:
# Backend:
npm run dev

# Frontend (in another terminal):
cd client
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🤖 AI Feature Setup

### Get Your FREE Gemini API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API key"
4. Copy the key and add it to your `.env` file as `GEMINI_API_KEY`

### How It Works

When users upload a coupon image:
1. AI analyzes the image
2. Extracts: title, brand, discount %, code, expiry, etc.
3. Auto-fills the listing form
4. User reviews and submits!

**Free Tier:** 60 requests/minute - perfect for development!

## 📁 Project Structure

```
mopons/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── App.js          # Main app component
│       ├── Dashboard.js    # User dashboard
│       ├── Marketplace.js  # Coupon marketplace
│       └── Vault.js        # User's coupon vault
├── config/                 # Configuration files
│   ├── db.js              # MongoDB connection
│   └── passport.js        # Authentication config
├── controllers/           # Business logic
│   ├── authController.js
│   ├── couponController.js
│   └── walletController.js
├── models/               # Database models
│   ├── User.js
│   ├── Coupon.js
│   ├── Transaction.js
│   └── Category.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── couponRoutes.js
│   ├── walletRoutes.js
│   └── ai.js           # AI extraction routes
├── utils/              # Utility functions
│   └── aiService.js   # AI/OCR service
├── middleware/        # Custom middleware
│   ├── auth.js
│   └── errorHandler.js
├── server.js         # Express server
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Coupons
- `GET /api/coupons` - Get all coupons (marketplace)
- `GET /api/coupons/:id` - Get single coupon
- `POST /api/coupons` - Create new coupon
- `POST /api/coupons/:id/buy` - Purchase coupon
- `PUT /api/coupons/:id` - Update coupon
- `DELETE /api/coupons/:id` - Delete coupon

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/add-funds` - Add funds
- `GET /api/wallet/transactions` - Get transactions

### AI Features
- `POST /api/ai/extract-coupon` - Extract coupon details from image
- `POST /api/ai/validate-coupon` - Validate coupon image

## 🎨 Tech Stack

### Frontend
- React.js
- CSS3 (Glassmorphism design)
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Google Gemini AI
- Cloudinary (image storage)

## 📝 User Flow

1. **Sign Up / Login** → Get ₹1000 welcome bonus
2. **Browse Marketplace** → Find coupons you want
3. **Purchase Coupon** → Pay with wallet balance
4. **View in Vault** → Access your coupon code
5. **List Your Own** → Upload image, AI fills details
6. **Earn Money** → Sell unused coupons

## 🔒 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Input validation
- CORS enabled
- Helmet.js security headers

## 🚀 Deployment

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions for:
- Vercel (Frontend)
- Railway (Backend)
- MongoDB Atlas (Database)

## 📚 Additional Documentation

- `OCR_FEATURE.md` - Detailed AI/OCR documentation
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `PROJECT-DOCUMENTATION.md` - Technical documentation
- `QUICK-START.md` - Getting started guide

## 🐛 Troubleshooting

### MongoDB Connection Error
Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo service mongod start
```

### AI Extract Fails
1. Check if `GEMINI_API_KEY` is in `.env`
2.Restart the server to load environment variables
3. Verify API key at https://aistudio.google.com/app/apikey

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Google Gemini AI for OCR capabilities
- Cloudinary for image hosting
- MongoDB for the database
- React.js community

---

**Need help?** Open an issue or contact vedhas@example.com
