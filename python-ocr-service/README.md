# 🐍 Python OCR Service for MOPONS

## What is This?

A Python-based OCR (Optical Character Recognition) microservice that extracts coupon details from images using **EasyOCR**.

### Why Python Instead of Gemini?

- ✅ **Works Offline** - No API keys needed
- ✅ **No Rate Limits** - Process unlimited images
- ✅ **Better Accuracy** - EasyOCR is battle-tested
- ✅ **Free Forever** - No costs
- ✅ **Reliable** - Proven technology

---

## 🚀 Quick Setup

### 1. Install Python (if not already installed)

Download Python 3.8+ from: https://www.python.org/downloads/

**IMPORTANT:** During installation, check "Add Python to PATH"!

### 2. Install Dependencies

```bash
cd python-ocr-service
pip install -r requirements.txt
```

**Note:** First install will download ~500MB of OCR models. This is one-time only.

### 3. Start the Python Service

```bash
python app.py
```

You should see:
```
🐍 Python OCR Service Starting...
🔄 Initializing EasyOCR reader...
✅ EasyOCR reader initialized!
 * Running on http://0.0.0.0:5001
```

### 4. Start Your Node.js Backend (in another terminal)

```bash
cd ..
npm run dev all
```

---

## 🎯 How It Works

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ─────▶  │   Node.js    │ ─────▶  │   Python    │
│  (React)    │         │   Backend    │         │   OCR       │
│             │         │   (Port 5000)│         │  (Port 5001)│
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │                         │
      │                        │                         │
  Upload image          Forward to Python        Extract text
                        Get extracted data      Parse coupon details
                        Return to frontend       Return JSON
```

---

## 📡 API Endpoints

### Health Check
```
GET http://localhost:5001/health

Response:
{
  "status": "healthy",
  "service": "Python OCR Service",
  "version": "1.0.0"
}
```

### Extract Coupon
```
POST http://localhost:5001/extract-coupon
Content-Type: multipart/form-data

Form data:
- image: (binary file)

Response:
{
  "success": true,
  "data": {
    "title": "30% off at Amazon",
    "brand": "Amazon",
    "description": "30% OFF On Electronics & Gadgets",
    "discountPercentage": 30,
    "originalPrice": 2999,
    "sellingPrice": 2099,
    "couponCode": "TECH30",
    "expiryDate": "31st January 2026",
    "termsAndConditions": "Minimum purchase ₹1999..."
  },
  "raw_text": "AMAZON 30% OFF On Electronics & Gadgets...",
  "debug": {
    "text_items_count": 8,
    "avg_confidence": 0.92
  }
}
```

---

## 🔧 Configuration

### Change Port

Edit `app.py`:
```python
app.run(
    host='0.0.0.0',
    port=5001,  # Change this
    debug=True
)
```

Then update `.env` in main project:
```env
PYTHON_OCR_URL=http://localhost:YOUR_PORT
```

---

## 🧪 Testing

### Test with cURL

```bash
curl -X POST -F "image=@test_coupon.jpg" http://localhost:5001/extract-coupon
```

### Test with Python

```python
import requests

url = 'http://localhost:5001/extract-coupon'
files = {'image': open('coupon.jpg', 'rb')}
response = requests.post(url, files=files)
print(response.json())
```

---

## 🐛 Troubleshooting

### Issue: "Module not found"
**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: "Python not recognized"
**Solution:** 
- Reinstall Python and check "Add to PATH"
- Or use full path: `C:\Python\python.exe app.py`

### Issue: "Port 5001 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5001 | xargs kill
```

### Issue: "Connection refused from Node.js"
**Solution:** Make sure Python service is running first!

---

## 📊 Performance

- **Cold start:** 3-5 seconds (loading models)
- **Warm extraction:** 1-2 seconds per image
- **Accuracy:** ~90-95% for clear images
- **Supported formats:** JPG, PNG, WEBP, BMP

---

## 🚀 Production Deployment

### Option 1: Deploy with Node.js on Same Server

```bash
# Install Python on server
sudo apt-get install python3 python3-pip

# Install dependencies
cd python-ocr-service
pip3 install -r requirements.txt

# Run with PM2
pm2 start app.py --name python-ocr --interpreter python3
```

### Option 2: Separate Python Service

Deploy Python service on **Railway**, **Render**, or **Heroku**

Update `.env`:
```env
PYTHON_OCR_URL=https://your-python-service.railway.app
```

---

## 🎨 What It Extracts

- ✅ **Brand** - Company/store name
- ✅ **Title** - Offer description  
- ✅ **Discount %** - Percentage off
- ✅ **Original Price** - Before discount
- ✅ **Sale Price** - After discount
- ✅ **Coupon Code** - The actual code
- ✅ **Expiry Date** - Validity period
- ✅ **Terms** - Conditions/restrictions

---

## 📝 Notes

- First run downloads OCR models (~500MB) - be patient!
- GPU support available - set `gpu=True` in app.py if you have CUDA
- Works offline once models are downloaded
- No API keys or internet required after setup

---

## 💡 Tips for Best Results

1. **Clear images** - Good lighting, no blur
2. **High resolution** - At least 500x500px
3. **Straight text** - Avoid rotated coupons
4. **Zoom in** - Crop to show only the coupon

---

**Ready to use!** Start the Python service, then test the frontend! 🎉
