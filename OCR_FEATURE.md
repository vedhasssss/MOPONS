# 🤖 OCR Feature - Automatic Coupon Extraction

## Overview

MOPONS uses **Tesseract.js** for automatic coupon detail extraction from images. Users can upload a coupon image and the system will automatically extract and fill in the details.

---

## ✨ Features

- ✅ **100% Free** - No API costs
- ✅ **No API Key Required** - Works out of the box
- ✅ **Runs Locally** - Fast and private
- ✅ **Automatic Extraction** - Discount %, prices, codes, dates, etc.
- ✅ **Smart Parsing** - Intelligent pattern matching

---

## 🚀 How to Use

### For Users:

1. Go to **http://localhost:3000/vault**
2. Click **"+ Sell / Exchange Coupon"**
3. Upload a coupon image
4. Form auto-fills with extracted details
5. Review and submit!

### What Gets Extracted:

- **Discount Percentage** (e.g., "50% OFF")
- **Prices** (₹500, Rs. 500, $50)
- **Coupon Codes** (SAVE50, WELCOME20)
- **Expiry Dates** (various formats)
- **Brand Names**
- **Description**
- **Terms & Conditions**

---

## 💡 Tips for Best Results

### ✅ DO:
- Use clear, well-lit images
- Ensure text is horizontal (not rotated)
- Crop to show only the coupon
- Use high-resolution images (> 300px)
- Good contrast between text and background

### ❌ DON'T:
- Use blurry or dark images
- Include multiple coupons in one image
- Use heavily stylized fonts
- Upload very small images

---

## 🔧 Technical Details

### How It Works:

1. **OCR Processing** - Tesseract extracts all text from the image
2. **Pattern Matching** - Regex patterns identify specific data:
   - Discount: `(\d+)\s*%?\s*(OFF|DISCOUNT)`
   - Prices: `(?:₹|Rs\.?|INR|\$)\s*(\d+)`
   - Codes: `([A-Z0-9]{4,15})`
   - Dates: Multiple date format patterns
3. **Smart Parsing** - Combines extracted data into structured format
4. **Auto-fill** - Populates the form fields

### Files:

- `utils/aiService.js` - OCR implementation
- `routes/ai.js` - API endpoints
- `client/src/Vault.js` - Frontend integration

---

## 📊 Accuracy

- **Clear images**: 80-95% accuracy
- **Fair images**: 50-80% accuracy
- **Poor images**: < 50% accuracy

Users can always manually edit the extracted data before submitting.

---

## 🐛 Troubleshooting

### OCR is slow
- Normal behavior - Tesseract takes 3-5 seconds

### Poor extraction accuracy
- Use clearer images
- Increase image resolution
- Ensure good lighting
- Make sure text is horizontal

### No text extracted
- Verify image contains readable text
- Check image format (JPG, PNG, WEBP)
- Check server logs for errors

---

## 📦 Dependencies

```json
{
  "tesseract.js": "^5.x.x"
}
```

---

## 🔄 Future Enhancements

- [ ] Image preprocessing (auto-rotate, enhance contrast)
- [ ] Multi-language support
- [ ] Batch processing
- [ ] Confidence scoring
- [ ] Machine learning for better parsing

---

**Built with ❤️ using Tesseract.js**
