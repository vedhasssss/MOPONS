# 📡 MOPONS API Testing Guide

## Postman Collection

### Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. Register User
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+919876543210"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "user": {
      "id": "64a1b2c3...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "walletBalance": 0,
      "isVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login User
```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64a1b2c3...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "walletBalance": 0,
      "isVerified": false,
      "avatar": "https://..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ Save the token for authenticated requests!**

---

### 3. Get Current User
```
GET {{base_url}}/auth/me
Authorization: Bearer {{token}}
```

---

### 4. Logout
```
POST {{base_url}}/auth/logout
Authorization: Bearer {{token}}
```

---

## 💰 Wallet Endpoints

### 1. Get Wallet Balance
```
GET {{base_url}}/wallet/balance
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "balance": 0
  }
}
```

---

### 2. Add Money to Wallet
```
POST {{base_url}}/wallet/add-money
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "amount": 1000,
  "paymentMethod": "upi"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Money added successfully",
  "data": {
    "transaction": {
      "_id": "...",
      "userId": "...",
      "type": "credit",
      "category": "wallet_topup",
      "amount": 1000,
      "balanceBefore": 0,
      "balanceAfter": 1000,
      "status": "completed",
      "description": "Wallet top-up via upi"
    },
    "newBalance": 1000
  }
}
```

---

### 3. Get Transaction History
```
GET {{base_url}}/wallet/transactions?page=1&limit=20
Authorization: Bearer {{token}}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `type` (optional): credit | debit
- `category` (optional): wallet_topup | coupon_purchase | coupon_sale

---

## 🎟️ Coupon Endpoints

### 1. Get All Coupons
```
GET {{base_url}}/coupons?page=1&limit=12&category=64a1b2c3...&minPrice=100&maxPrice=500
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Category ID
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `search` (optional): Search term
- `sort` (optional): -createdAt | sellingPrice | -sellingPrice

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "_id": "...",
        "title": "50% Off on Pizza",
        "description": "Get 50% discount...",
        "category": {
          "_id": "...",
          "name": "Food & Dining",
          "icon": "🍔"
        },
        "sellingPrice": 200,
        "originalPrice": 1000,
        "discountPercentage": 50,
        "image": "https://...",
        "expiryDate": "2024-12-31",
        "status": "active"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCoupons": 58,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

### 2. Get Single Coupon
```
GET {{base_url}}/coupons/:id
```

---

### 3. Create Coupon
```
POST {{base_url}}/coupons
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

Form Data:
- title: "50% Off on Pizza"
- description: "Get 50% discount on all pizzas"
- category: "64a1b2c3..." (Category ID)
- brand: "Dominos"
- discountPercentage: 50
- originalPrice: 1000
- sellingPrice: 200
- isExchangeOnly: false
- couponCode: "PIZZA50"
- termsAndConditions: "Valid on orders above ₹500"
- expiryDate: "2024-12-31"
- image: [file upload]
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Coupon submitted for approval",
  "data": {
    "_id": "...",
    "title": "50% Off on Pizza",
    "status": "pending_approval",
    ...
  }
}
```

---

### 4. Buy Coupon
```
POST {{base_url}}/coupons/:id/buy
Authorization: Bearer {{token}}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Coupon purchased successfully",
  "data": {
    "transaction": {...},
    "coupon": {...},
    "newWalletBalance": 800
  }
}
```

**Possible Errors:**
- 400: Insufficient wallet balance
- 400: Coupon not available
- 400: Cannot buy own coupon
- 400: Exchange only coupon

---

### 5. Mark Coupon as Used
```
PUT {{base_url}}/coupons/:id/mark-used
Authorization: Bearer {{token}}
```

---

### 6. Update Coupon
```
PUT {{base_url}}/coupons/:id
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

Form Data:
- title: "Updated Title"
- sellingPrice: 150
- image: [optional file upload]
```

---

### 7. Delete Coupon
```
DELETE {{base_url}}/coupons/:id
Authorization: Bearer {{token}}
```

---

## 🧪 Test Scenarios

### Scenario 1: Complete User Journey

1. **Register** → Get token
2. **Login** → Verify token works
3. **Add Money** → Add ₹1000
4. **Check Balance** → Should show ₹1000
5. **View Coupons** → Browse marketplace
6. **Buy Coupon** → Purchase a coupon
7. **Check Balance** → Should be reduced
8. **View Transactions** → See purchase history

---

### Scenario 2: Coupon Lifecycle

1. **Create Coupon** → Upload new coupon
2. **Check Status** → Should be "pending_approval"
3. **Admin Approves** → Status becomes "active"
4. **Another User Buys** → Status becomes "sold"
5. **New Owner Marks Used** → Status becomes "used"

---

### Scenario 3: Error Handling

1. **Login with wrong password** → Should return 401
2. **Buy without balance** → Should return 400
3. **Access protected route without token** → Should return 401
4. **Upload invalid file type** → Should return 400
5. **Create coupon with past expiry** → Should return 400

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 🔧 Postman Environment Variables

Create environment with these variables:

```
base_url: http://localhost:5000/api
token: (will be set after login)
user_id: (will be set after login)
```

---

## 📝 Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Access protected route with valid token
- [ ] Logout

### Wallet
- [ ] Get initial balance (should be 0)
- [ ] Add money (₹1000)
- [ ] Verify balance updated
- [ ] Get transaction history
- [ ] Try adding negative amount (should fail)

### Coupons
- [ ] Get all coupons
- [ ] Filter by category
- [ ] Filter by price range
- [ ] Search coupons
- [ ] Get single coupon
- [ ] Create coupon with image
- [ ] Create coupon without image (should fail)
- [ ] Buy coupon with sufficient balance
- [ ] Buy coupon without balance (should fail)
- [ ] Buy own coupon (should fail)
- [ ] Mark coupon as used

---

## 🐛 Common Issues

### Issue: "Not authorized"
**Solution:** Add Authorization header with Bearer token

### Issue: "Coupon not found"
**Solution:** Use valid coupon ID from GET /coupons response

### Issue: "Insufficient wallet balance"
**Solution:** Add money to wallet first using POST /wallet/add-money

### Issue: "File upload failed"
**Solution:** 
- Use multipart/form-data
- File size < 5MB
- File type: jpeg, jpg, png, gif, webp

---

## 📱 cURL Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Add Money
```bash
curl -X POST http://localhost:5000/api/wallet/add-money \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"amount":1000,"paymentMethod":"upi"}'
```

### Get Coupons
```bash
curl http://localhost:5000/api/coupons?page=1&limit=12
```

---

**Happy Testing! 🧪**
