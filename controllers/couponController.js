const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const { uploadToCloudinary } = require('../utils/cloudinaryHelper');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// @desc    Get all coupons (with filters)
// @route   GET /api/coupons
// @access  Public
exports.getCoupons = async (req, res, next) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 12,
      status = 'active'
    } = req.query;

    // Build query
    const query = { status };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const coupons = await Coupon.find(query)
      .populate('category', 'name icon color')
      .populate('ownerId', 'name avatar')
      .sort(sort)
      .limit(Number(limit))
      .skip(skip);

    // Get total count
    const total = await Coupon.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        coupons,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
          totalCoupons: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Public
exports.getCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('category', 'name icon color')
      .populate('ownerId', 'name avatar email phone')
      .populate('sellerId', 'name avatar');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Increment views
    coupon.views += 1;
    await coupon.save();

    res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private
exports.createCoupon = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      brand,
      discountPercentage,
      originalPrice,
      sellingPrice,
      isExchangeOnly,
      couponCode,
      termsAndConditions,
      expiryDate
    } = req.body;

    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a coupon image'
      });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(req.file.buffer, 'mopons/coupons');

    // Create coupon
    const coupon = await Coupon.create({
      sellerId: req.user.id,
      ownerId: req.user.id,
      title,
      description,
      category,
      brand,
      discountPercentage,
      originalPrice,
      sellingPrice: isExchangeOnly === 'true' ? 0 : sellingPrice,
      isExchangeOnly: isExchangeOnly === 'true',
      couponCode,
      termsAndConditions,
      expiryDate,
      image: imageUrl
    });

    // Get user's current wallet balance for transaction record
    const user = await User.findById(req.user.id);

    // Create transaction record for activity log
    await Transaction.create({
      userId: req.user.id,
      type: 'info',
      category: 'coupon_listing',
      amount: 0,
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance,
      couponId: coupon._id,
      status: 'completed',
      description: `Listed: ${coupon.title}`
    });

    res.status(201).json({
      success: true,
      message: 'Coupon listed successfully',
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private
exports.updateCoupon = async (req, res, next) => {
  try {
    let coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check ownership
    if (coupon.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this coupon'
      });
    }

    // Update image if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'mopons/coupons');
      req.body.image = imageUrl;
    }

    coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check ownership
    if (coupon.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this coupon'
      });
    }

    await coupon.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Buy coupon
// @route   POST /api/coupons/:id/buy
// @access  Private
exports.buyCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate('ownerId');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check if coupon is available
    if (coupon.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not available for purchase'
      });
    }

    // Check if user is trying to buy their own coupon
    if (coupon.ownerId._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot buy your own coupon'
      });
    }

    // Check if exchange only
    if (coupon.isExchangeOnly) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is available for exchange only'
      });
    }

    const buyer = await User.findById(req.user.id);
    const seller = await User.findById(coupon.ownerId._id);

    // Check buyer's wallet balance
    if (buyer.walletBalance < coupon.sellingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Perform transaction
    const buyerBalanceBefore = buyer.walletBalance;
    const sellerBalanceBefore = seller.walletBalance;

    buyer.walletBalance -= coupon.sellingPrice;
    seller.walletBalance += coupon.sellingPrice;

    buyer.totalCouponsBought += 1;
    buyer.totalSpent += coupon.sellingPrice;
    seller.totalCouponsSold += 1;

    // Calculate savings
    if (coupon.originalPrice) {
      buyer.totalSavings += (coupon.originalPrice - coupon.sellingPrice);
    }

    await buyer.save();
    await seller.save();

    // Transfer coupon ownership
    coupon.ownerId = buyer._id;
    coupon.status = 'sold';
    coupon.soldAt = Date.now();
    await coupon.save();

    // Create transaction records
    const buyerTransaction = await Transaction.create({
      userId: buyer._id,
      type: 'debit',
      category: 'coupon_purchase',
      amount: coupon.sellingPrice,
      balanceBefore: buyerBalanceBefore,
      balanceAfter: buyer.walletBalance,
      couponId: coupon._id,
      relatedUserId: seller._id,
      status: 'completed',
      description: `Purchased: ${coupon.title}`
    });

    const sellerTransaction = await Transaction.create({
      userId: seller._id,
      type: 'credit',
      category: 'coupon_sale',
      amount: coupon.sellingPrice,
      balanceBefore: sellerBalanceBefore,
      balanceAfter: seller.walletBalance,
      couponId: coupon._id,
      relatedUserId: buyer._id,
      status: 'completed',
      description: `Sold: ${coupon.title}`
    });

    // Create notifications
    await Notification.create({
      userId: buyer._id,
      type: 'transaction',
      title: 'Purchase Successful',
      message: `You have successfully purchased "${coupon.title}"`,
      relatedId: coupon._id,
      relatedModel: 'Coupon',
      actionUrl: `/vault`
    });

    await Notification.create({
      userId: seller._id,
      type: 'coupon_sold',
      title: 'Coupon Sold!',
      message: `Your coupon "${coupon.title}" has been sold for ₹${coupon.sellingPrice}`,
      relatedId: coupon._id,
      relatedModel: 'Coupon',
      actionUrl: `/wallet`
    });

    // Send email to seller
    try {
      await sendEmail({
        email: seller.email,
        subject: 'Coupon Sold - MOPONS',
        html: emailTemplates.couponSold(seller.name, coupon, coupon.sellingPrice)
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Coupon purchased successfully',
      data: {
        transaction: buyerTransaction,
        coupon,
        newWalletBalance: buyer.walletBalance
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark coupon as used
// @route   PUT /api/coupons/:id/mark-used
// @access  Private
exports.markAsUsed = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // Check ownership
    if (coupon.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    coupon.status = 'used';
    coupon.usedAt = Date.now();
    await coupon.save();

    res.status(200).json({
      success: true,
      message: 'Coupon marked as used',
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};
