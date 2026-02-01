const axios = require('axios');
const FormData = require('form-data');

// Python OCR service URL
const PYTHON_OCR_URL = process.env.PYTHON_OCR_URL || 'http://localhost:5001';

/**
 * Extract coupon details from an image using Python OCR service
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<Object>} Extracted coupon details
 */
async function extractCouponDetails(imageBuffer, mimeType) {
  try {
    console.log('🐍 Calling Python OCR service...');
    
    // Create form data
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: 'coupon.jpg',
      contentType: mimeType
    });
    
    // Call Python OCR service
    const response = await axios.post(`${PYTHON_OCR_URL}/extract-coupon`, formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 30000 // 30 second timeout
    });
    
    if (response.data.success) {
      console.log('✅ Python OCR extraction successful');
      console.log('Extracted data:', response.data.data);
      
      return {
        success: true,
        data: response.data.data,
        rawText: response.data.raw_text,
        debug: response.data.debug
      };
    } else {
      console.error('❌ Python OCR extraction failed:', response.data.message);
      return {
        success: false,
        error: response.data.message,
        message: 'Failed to extract coupon details from image'
      };
    }
    
  } catch (error) {
    console.error('❌ Error calling Python OCR service:', error.message);
    
    // Check if Python service is running
    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        error: 'Python OCR service is not running',
        message: 'Please start the Python OCR service on port 5001'
      };
    }
    
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
    // For now, just check if we can extract any text
    const result = await extractCouponDetails(imageBuffer, mimeType);
    
    if (result.success && result.rawText && result.rawText.length > 10) {
      return {
        success: true,
        isValid: true,
        confidence: 85,
        reason: 'Image contains readable text'
      };
    } else {
      return {
        success: true,
        isValid: false,
        confidence: 20,
        reason: 'Image does not contain enough readable text'
      };
    }
    
  } catch (error) {
    console.error('❌ Error validating coupon image:', error);
    return {
      success: true,
      isValid: true,
      confidence: 50,
      reason: 'Validation skipped due to error'
    };
  }
}

/**
 * Check if Python OCR service is running
 * @returns {Promise<boolean>} True if service is healthy
 */
async function checkPythonServiceHealth() {
  try {
    const response = await axios.get(`${PYTHON_OCR_URL}/health`, {
      timeout: 5000
    });
    return response.data.status === 'healthy';
  } catch (error) {
    return false;
  }
}

module.exports = {
  extractCouponDetails,
  validateCouponImage,
  checkPythonServiceHealth
};
