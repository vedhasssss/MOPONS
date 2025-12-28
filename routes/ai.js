const express = require('express');
const router = express.Router();
const multer = require('multer');
const { extractCouponDetails, validateCouponImage } = require('../utils/aiService');
const { protect } = require('../middleware/auth');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// @desc    Extract coupon details from image using AI
// @route   POST /api/ai/extract-coupon
// @access  Private
router.post('/extract-coupon', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Extract coupon details using AI
    const result = await extractCouponDetails(req.file.buffer, req.file.mimetype);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Failed to extract coupon details'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon details extracted successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Error in extract-coupon:', error);
    next(error);
  }
});

// @desc    Validate if image is a coupon
// @route   POST /api/ai/validate-coupon
// @access  Private
router.post('/validate-coupon', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Validate coupon image using AI
    const result = await validateCouponImage(req.file.buffer, req.file.mimetype);

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in validate-coupon:', error);
    next(error);
  }
});

module.exports = router;
