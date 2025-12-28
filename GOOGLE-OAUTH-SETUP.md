# 🔐 Google OAuth Setup Guide for MOPONS

## ✅ What's Been Implemented

I've set up complete Google OAuth authentication for your MOPONS application!

### Backend Changes:
1. ✅ Installed `passport` and `passport-google-oauth20`
2. ✅ Created `config/passport.js` - Passport configuration
3. ✅ Created `routes/googleAuthRoutes.js` - OAuth routes
4. ✅ Updated `models/User.js` - Added `googleId` field
5. ✅ Updated `server.js` - Integrated Passport middleware
6. ✅ Updated `.env.example` - Added Google OAuth variables

### Frontend Changes:
1. ✅ Updated `Auth.js` - Google button now redirects to OAuth
2. ✅ Updated `Dashboard.js` - Handles OAuth callback token

---

## 🚀 How to Set Up Google OAuth

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project:**
   - Click "Select a project" → "New Project"
   - Name it: "MOPONS"
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Name: "MOPONS Web Client"
   
5. **Configure OAuth Consent Screen:**
   - Click "Configure Consent Screen"
   - Choose "External"
   - Fill in:
     - App name: MOPONS
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Add scopes: email, profile
   - Click "Save and Continue"

6. **Set Authorized Redirect URIs:**
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:5000
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
   - Click "Create"

7. **Copy Credentials:**
   - You'll see "Client ID" and "Client Secret"
   - **IMPORTANT:** Copy these values!

---

### Step 2: Update Your .env File

Open your `.env` file and add:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

Replace `your_actual_client_id_here` and `your_actual_client_secret_here` with the values from Google Cloud Console.

---

### Step 3: Restart Your Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 How to Test

1. **Go to Login Page:**
   - http://localhost:3000/login

2. **Click "Sign in with Google"**
   - You'll be redirected to Google's login page

3. **Choose Your Google Account**
   - Select the account you want to use

4. **Grant Permissions**
   - Allow MOPONS to access your profile and email

5. **Success!**
   - You'll be redirected back to the Dashboard
   - You're now logged in with Google!

---

## 🔄 How It Works

### The OAuth Flow:

1. **User clicks "Sign in with Google"**
   → Frontend redirects to: `http://localhost:5000/api/auth/google`

2. **Backend redirects to Google**
   → User sees Google login page

3. **User logs in with Google**
   → Google redirects back to: `http://localhost:5000/api/auth/google/callback`

4. **Backend processes the callback**
   - Checks if user exists (by email)
   - If yes: Updates googleId
   - If no: Creates new user
   - Generates JWT token

5. **Backend redirects to Dashboard**
   → With token in URL: `http://localhost:3000/dashboard?token=...`

6. **Frontend saves token**
   - Stores token in localStorage
   - Cleans URL
   - User is logged in!

---

## 🔐 Security Features

- ✅ **JWT Tokens** - Secure authentication
- ✅ **Email Verification** - Google emails are pre-verified
- ✅ **Unique googleId** - Prevents duplicate accounts
- ✅ **Password Optional** - Google users don't need passwords
- ✅ **Secure Cookies** - HttpOnly cookies in production

---

## 🎯 What Happens for Users

### New Users (First Time Google Login):
1. Click "Sign in with Google"
2. Choose Google account
3. New account created automatically
4. Email is pre-verified
5. Redirected to Dashboard

### Existing Users (Already Registered):
1. If email matches existing account
2. googleId is linked to account
3. Can now use both email/password AND Google login

---

## 🐛 Troubleshooting

### Error: "Redirect URI mismatch"
**Solution:** Make sure you added the exact callback URL in Google Cloud Console:
```
http://localhost:5000/api/auth/google/callback
```

### Error: "Client ID not found"
**Solution:** Check your `.env` file has the correct `GOOGLE_CLIENT_ID`

### Error: "Invalid client secret"
**Solution:** Check your `.env` file has the correct `GOOGLE_CLIENT_SECRET`

### Button doesn't work
**Solution:** 
1. Make sure backend is running on port 5000
2. Check browser console for errors
3. Verify `.env` has Google credentials

---

## 📝 Environment Variables Needed

```env
# Required for Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

---

## 🎉 Benefits of Google OAuth

1. **Faster Registration** - One-click signup
2. **No Password Management** - Google handles it
3. **Pre-verified Emails** - No email verification needed
4. **Better UX** - Familiar Google login
5. **More Secure** - Google's security infrastructure

---

## 🚀 Production Deployment

When deploying to production:

1. **Update Authorized URIs in Google Console:**
   ```
   https://yourdomain.com
   https://api.yourdomain.com/api/auth/google/callback
   ```

2. **Update .env:**
   ```env
   CLIENT_URL=https://yourdomain.com
   NODE_ENV=production
   ```

3. **Enable HTTPS** - Required for production OAuth

---

## ✨ Your Google OAuth is Ready!

Once you add your Google credentials to `.env`, the "Sign in with Google" button will be fully functional! 🎊
