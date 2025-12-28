const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offeredCouponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  requestedCouponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true
  },
  additionalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  negotiationHistory: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    offeredAmount: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
    }
  },
  completedAt: Date
}, {
  timestamps: true
});

// Index for exchange queries
exchangeSchema.index({ requesterId: 1, status: 1 });
exchangeSchema.index({ ownerId: 1, status: 1 });
exchangeSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Exchange', exchangeSchema);
