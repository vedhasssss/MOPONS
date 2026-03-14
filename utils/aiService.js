const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Extract coupon details from an image using Gemini Vision AI
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<Object>} Extracted coupon details
 */
async function extractCouponDetails(imageBuffer, mimeType) {
  try {
    console.log('🤖 Calling Gemini Vision AI for coupon extraction...');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a coupon data extraction assistant. Analyze this coupon image and extract the following details in JSON format:
{
  "code": "coupon code if visible",
  "title": "coupon title or offer description",
  "discount": "discount amount or percentage",
  "discountType": "percentage or fixed",
  "expiryDate": "expiry date in YYYY-MM-DD format if visible, otherwise null",
  "category": "category of coupon (e.g. food, shopping, travel)",
  "brand": "brand or store name",
  "terms": "any terms and conditions",
  "minPurchase": "minimum purchase amount if mentioned, otherwise null"
}
Only return valid JSON. If a field cannot be determined, use null.`;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        success: false,
        error: 'Could not parse coupon details from image',
        message: 'The AI could not extract structured data from this image'
      };
    }

    const data = JSON.parse(jsonMatch[0]);
    console.log('✅ Gemini AI extraction successful');

    return {
      success: true,
      data,
      rawText: text
    };

  } catch (error) {
    console.error('❌ Error calling Gemini AI:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'Failed to extract coupon details from image'
    };
  }
}

/**
 * Validate if an image is likely a coupon
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<Object>} Validation result
 */
async function validateCouponImage(imageBuffer, mimeType) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Is this image a coupon, voucher, or discount offer? Reply in JSON format:
{
  "isValid": true or false,
  "confidence": number between 0-100,
  "reason": "brief explanation"
}
Only return valid JSON.`;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: true, isValid: true, confidence: 50, reason: 'Validation skipped' };
    }

    const data = JSON.parse(jsonMatch[0]);
    return { success: true, ...data };

  } catch (error) {
    console.error('❌ Error validating coupon image:', error.message);
    return { success: true, isValid: true, confidence: 50, reason: 'Validation skipped due to error' };
  }
}

module.exports = {
  extractCouponDetails,
  validateCouponImage
};
