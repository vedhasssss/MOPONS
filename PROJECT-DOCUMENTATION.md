# 🎓 MOPONS - B.Sc. IT Final Year Project

## 📊 Project Overview

**Project Name:** MOPONS (Money & Coupons)  
**Type:** B.Sc. IT Final Year Project  
**Target Score:** 400/400 Marks  
**Tech Stack:** MERN (MongoDB, Express.js, React.js, Node.js)

---

## 🎯 Project Objectives

1. Create a comprehensive coupon trading platform
2. Implement secure wallet and payment system
3. Enable coupon exchange between users
4. Provide analytics and savings tracking
5. Build admin panel for platform management
6. Implement smart expiry reminder system

---

## 📦 Modules Implemented

### ✅ Module 1: User Management
- User registration with email verification
- JWT-based authentication
- Profile management
- Password reset functionality
- KYC verification system
- User preferences

### ✅ Module 2: Coupon Marketplace
- Browse coupons with filters
- Advanced search functionality
- Category-based organization
- Coupon upload with image
- Buy/Sell coupons
- Coupon verification by admin

### ✅ Module 3: Wallet System
- Virtual wallet balance
- Add money (payment integration ready)
- Transaction history
- Secure payment processing
- Balance tracking

### ✅ Module 4: Coupon Vault
- Personal coupon storage
- Expiry tracking
- Usage tracking
- Filter and sort options
- Mark as used functionality

### ✅ Module 5: Exchange System
- Request coupon exchange
- Negotiation system
- Accept/Reject exchanges
- Exchange history
- Auto-expiry after 48 hours

### ✅ Module 6: Analytics Dashboard
- Savings calculator
- Usage statistics
- Category-wise analysis
- Monthly reports
- Visual charts (ready for integration)

### ✅ Module 7: Notification System
- In-app notifications
- Email notifications
- Expiry reminders (1, 3, 7 days)
- Transaction alerts
- Exchange notifications

### ✅ Module 8: Admin Panel
- Dashboard with statistics
- User management (block/unblock)
- Coupon moderation
- Dispute resolution
- Activity logs
- Platform analytics

---

## 🗄️ Database Schema

### Collections:
1. **users** - User accounts and profiles
2. **coupons** - Coupon listings
3. **transactions** - Wallet transactions
4. **exchanges** - Exchange requests
5. **notifications** - User notifications
6. **categories** - Coupon categories
7. **disputes** - User disputes
8. **adminlogs** - Admin activity logs

### Relationships:
- User → Coupons (1:N)
- User → Transactions (1:N)
- User → Exchanges (1:N)
- Coupon → Category (N:1)
- Exchange → Coupons (N:M)

---

## 🔐 Security Features

✅ Password hashing (bcrypt - 10 rounds)  
✅ JWT authentication  
✅ HTTP security headers (helmet)  
✅ CORS protection  
✅ Rate limiting (100 req/15 min)  
✅ Input validation  
✅ File upload validation  
✅ XSS protection  
✅ NoSQL injection prevention  
✅ User blocking system  

---

## 📡 API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user
- GET `/api/auth/verify-email/:token` - Verify email
- POST `/api/auth/forgot-password` - Forgot password
- PUT `/api/auth/reset-password/:token` - Reset password

### Coupons
- GET `/api/coupons` - Get all coupons (with filters)
- GET `/api/coupons/:id` - Get single coupon
- POST `/api/coupons` - Create coupon
- PUT `/api/coupons/:id` - Update coupon
- DELETE `/api/coupons/:id` - Delete coupon
- POST `/api/coupons/:id/buy` - Buy coupon
- PUT `/api/coupons/:id/mark-used` - Mark as used

### Wallet
- GET `/api/wallet/balance` - Get balance
- POST `/api/wallet/add-money` - Add money
- GET `/api/wallet/transactions` - Get transactions
- GET `/api/wallet/transactions/:id` - Get transaction details

---

## 🎨 UI/UX Features

✅ Blue-Pink gradient theme  
✅ Responsive design  
✅ Modern glassmorphism effects  
✅ Smooth animations  
✅ Card-based layouts  
✅ Intuitive navigation  
✅ Mobile-friendly  
✅ Accessibility features  

---

## 🚀 Installation & Setup

### Backend Setup

1. **Navigate to project directory**
```bash
cd mopons
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create `.env` file with:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mopons
JWT_SECRET=your_secret_key
# ... (see .env.example)
```

4. **Seed categories**
```bash
npm run seed
```

5. **Start backend server**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to client directory**
```bash
cd client
```

2. **Install dependencies**
```bash
npm install
```

3. **Start React app**
```bash
npm start
```

---

## 📸 Screenshots

### Landing Page
- Hero section with gradient background
- Feature cards
- How it works section
- Category showcase
- Call-to-action
- Footer

### Marketplace (Planned)
- Coupon grid layout
- Filter sidebar
- Search functionality
- Category filters

### Wallet (Planned)
- Balance display
- Add money button
- Transaction history
- Charts and graphs

### Analytics (Planned)
- Savings dashboard
- Usage statistics
- Category breakdown
- Monthly reports

---

## 🧪 Testing

### Backend Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

### Frontend Testing
- Open `http://localhost:3000`
- Navigate through all sections
- Test responsive design
- Check animations

---

## 📊 Project Scoring Breakdown

### Module Complexity (200 marks)
- 8 major modules × 25 marks = 200 marks

### Technical Implementation (100 marks)
- Backend API quality = 40 marks
- Frontend UI/UX = 30 marks
- Database design = 20 marks
- Security = 10 marks

### Documentation (50 marks)
- System architecture = 15 marks
- API documentation = 15 marks
- User manual = 10 marks
- Code comments = 10 marks

### Innovation (50 marks)
- Exchange system = 20 marks
- Analytics dashboard = 15 marks
- Smart notifications = 10 marks
- User experience = 5 marks

**Total: 400 Marks**

---

## 🎯 Unique Features

1. **Coupon Exchange System** - Not just buy/sell
2. **Negotiation in Exchanges** - Counter-offers
3. **Smart Expiry Reminders** - 1, 3, 7 days
4. **Comprehensive Analytics** - Track everything
5. **Wallet Integration** - Internal payment
6. **Admin Moderation** - Quality control
7. **Dispute Resolution** - Conflict management
8. **Activity Logging** - Full audit trail

---

## 📝 Future Enhancements

- [ ] Real-time chat between users
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Social features (reviews, ratings)
- [ ] Referral program
- [ ] Multi-language support
- [ ] Advanced analytics with ML
- [ ] Push notifications

---

## 🐛 Known Issues

- Email sending requires SMTP configuration
- Cloudinary requires account setup
- Payment gateway in test mode
- Some frontend pages pending

---

## 📚 Technologies Used

### Backend
- Node.js 18+
- Express.js 4.18+
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- Cloudinary for image storage
- Nodemailer for emails
- node-cron for scheduled tasks

### Frontend
- React.js 18+
- Modern CSS3
- Responsive design
- Gradient themes
- Animations

### Tools
- Git for version control
- Postman for API testing
- MongoDB Compass
- VS Code

---

## 👨‍💻 Developer Notes

### Code Structure
- Clean and modular code
- MVC architecture
- RESTful API design
- Error handling middleware
- Input validation
- Security best practices

### Database Design
- Normalized schema
- Proper indexing
- Relationships defined
- Validation rules

### API Design
- Consistent response format
- Proper HTTP status codes
- Pagination support
- Filter and search
- Error messages

---

## 📞 Support

For any issues or questions:
- Email: your.email@example.com
- GitHub: @yourusername

---

## 📄 License

This project is created for educational purposes as part of B.Sc. IT curriculum.

---

## ✅ Checklist for Submission

- [x] Backend API implemented
- [x] Database schema designed
- [x] Authentication system
- [x] Coupon marketplace
- [x] Wallet system
- [x] Exchange system
- [x] Notification system
- [x] Admin panel backend
- [x] Landing page frontend
- [ ] Complete frontend pages
- [ ] Testing completed
- [ ] Documentation finalized
- [ ] Video demonstration
- [ ] Blackbook prepared

---

**Project Status:** 70% Complete  
**Next Steps:** Complete remaining frontend pages, testing, and documentation

---

Made with ❤️ for B.Sc. IT Final Year Project
Target: 400/400 Marks 🎯
