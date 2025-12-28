const Tesseract = require('tesseract.js');

/**
 * Extract text from an image using Tesseract OCR
 * @param {Buffer} imageBuffer - Image buffer
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromImage(imageBuffer) {
  try {
    console.log('🔍 Starting OCR with Tesseract...');
    
    const result = await Tesseract.recognize(
      imageBuffer,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`📝 OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );

    console.log('✅ OCR completed successfully');
    return result.data.text;
  } catch (error) {
    console.error('❌ Error in OCR:', error);
    throw error;
  }
}

/**
 * Extract coupon details from text using pattern matching and AI-like parsing
 * @param {string} text - Extracted text from image
 * @returns {Object} Parsed coupon details
 */
function parseCouponDetails(text) {
  const details = {
    title: null,
    brand: null,
    description: null,
    discountPercentage: null,
    originalPrice: null,
    couponCode: null,
    expiryDate: null,
    termsAndConditions: null
  };

  // Clean up text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // Extract discount percentage (e.g., "50% OFF", "50%", "50 percent")
  const discountMatch = cleanText.match(/(\d+)\s*%?\s*(OFF|DISCOUNT|percent)/i);
  if (discountMatch) {
    details.discountPercentage = parseInt(discountMatch[1]);
  }

  // Extract prices (e.g., "₹500", "Rs. 500", "$50")
  const priceMatches = cleanText.match(/(?:₹|Rs\.?|INR|\$)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi);
  if (priceMatches && priceMatches.length > 0) {
    // First price is usually original price
    const priceValue = priceMatches[0].replace(/[₹Rs.INR$,\s]/g, '');
    details.originalPrice = parseFloat(priceValue);
  }

  // Extract coupon code (usually uppercase alphanumeric)
  const codeMatch = cleanText.match(/(?:CODE|COUPON)?\s*:?\s*([A-Z0-9]{4,15})/i);
  if (codeMatch) {
    details.couponCode = codeMatch[1].toUpperCase();
  }

  // Extract dates (various formats)
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,  // DD/MM/YYYY or DD-MM-YYYY
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,    // YYYY/MM/DD
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})/i
  ];

  for (const pattern of datePatterns) {
    const dateMatch = cleanText.match(pattern);
    if (dateMatch) {
      details.expiryDate = dateMatch[0];
      break;
    }
  }

  // Extract brand (usually at the top, capitalized)
  const brandMatch = lines.find(line => 
    line.length > 2 && 
    line.length < 30 && 
    /^[A-Z][A-Za-z\s&'-]+$/.test(line)
  );
  if (brandMatch) {
    details.brand = brandMatch;
  }

  // Generate title from discount and brand
  if (details.discountPercentage && details.brand) {
    details.title = `${details.discountPercentage}% off at ${details.brand}`;
  } else if (details.discountPercentage) {
    details.title = `${details.discountPercentage}% Discount Coupon`;
  } else if (lines.length > 0) {
    details.title = lines[0].substring(0, 50);
  }

  // Extract description (look for longer text blocks)
  const descLines = lines.filter(line => line.length > 20 && line.length < 200);
  if (descLines.length > 0) {
    details.description = descLines[0];
  }

  // Extract terms and conditions (usually contains "valid", "terms", "conditions")
  const termsLines = lines.filter(line => 
    /valid|terms|conditions|applicable|minimum|maximum/i.test(line)
  );
  if (termsLines.length > 0) {
    details.termsAndConditions = termsLines.join('. ');
  }

  return details;
}

/**
 * Extract coupon details from an image using Tesseract OCR
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} mimeType - Image MIME type (not used for Tesseract)
 * @returns {Promise<Object>} Extracted coupon details
 */
async function extractCouponDetails(imageBuffer, mimeType) {
  try {
    console.log('🤖 Extracting coupon details with Tesseract OCR...');
    
    // Step 1: Extract text from image
    const extractedText = await extractTextFromImage(imageBuffer);
    console.log('📄 Extracted text:', extractedText.substring(0, 200) + '...');

    // Step 2: Parse the text to extract coupon details
    const couponData = parseCouponDetails(extractedText);

    // Add the raw text for reference
    couponData.rawText = extractedText;

    return {
      success: true,
      data: couponData
    };

  } catch (error) {
    console.error('❌ Error extracting coupon details:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to extract coupon details from image. Please ensure the image is clear and contains readable text.'
    };
  }
}

/**
 * Validate if an image contains readable text
 * @param {Buffer} imageBuffer - Image buffer
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<Object>} Validation result
 */
async function validateCouponImage(imageBuffer, mimeType) {
  try {
    const extractedText = await extractTextFromImage(imageBuffer);
    
    // Check if we got meaningful text
    const wordCount = extractedText.split(/\s+/).filter(word => word.length > 2).length;
    const hasNumbers = /\d/.test(extractedText);
    const hasPercentage = /%/.test(extractedText);

    const isValid = wordCount > 3 && (hasNumbers || hasPercentage);
    const confidence = Math.min(100, wordCount * 10);

    return {
      success: true,
      isValid: isValid,
      confidence: confidence,
      reason: isValid 
        ? 'Image contains readable text that appears to be a coupon'
        : 'Image does not contain enough readable text'
    };

  } catch (error) {
    console.error('❌ Error validating coupon image:', error);
    return {
      success: false,
      isValid: false,
      confidence: 0,
      reason: 'Failed to read image'
    };
  }
}

module.exports = {
  extractCouponDetails,
  validateCouponImage,
  extractTextFromImage,
  parseCouponDetails
};
