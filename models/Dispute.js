const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  reason: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['fake_coupon', 'fraud', 'payment_issue', 'expired_coupon', 'other'],
    required: true
  },
  description: {
    type: String,
    required: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  evidence: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'investigating', 'resolved', 'rejected'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolution: {
    type: String
  },
  resolvedAt: Date
}, {
  timestamps: true
});

disputeSchema.index({ reporterId: 1, status: 1 });
disputeSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Dispute', disputeSchema);
