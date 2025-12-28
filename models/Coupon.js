const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please select a category']
  },
  brand: {
    type: String,
    trim: true
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  discountAmount: {
    type: Number,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: function() {
      return !this.isExchangeOnly;
    },
    min: 0
  },
  isExchangeOnly: {
    type: Boolean,
    default: false
  },
  exchangePreferences: [{
    type: String
  }],
  couponCode: {
    type: String,
    trim: true
  },
  termsAndConditions: {
    type: String,
    maxlength: [500, 'Terms cannot exceed 500 characters']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide an expiry date'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Expiry date must be in the future'
    }
  },
  image: {
    type: String,
    required: [true, 'Please upload an image']
  },
  additionalImages: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'expired', 'pending_approval', 'rejected', 'used'],
    default: 'active'
  },
  rejectionReason: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  usedAt: Date,
  soldAt: Date
}, {
  timestamps: true
});

// Index for search and filtering
couponSchema.index({ title: 'text', description: 'text', brand: 'text' });
couponSchema.index({ category: 1, status: 1 });
couponSchema.index({ ownerId: 1, status: 1 });
couponSchema.index({ expiryDate: 1 });
couponSchema.index({ status: 1, createdAt: -1 });

// Auto-expire coupons
couponSchema.pre('save', function(next) {
  if (this.expiryDate < new Date() && this.status === 'active') {
    this.status = 'expired';
  }
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);
