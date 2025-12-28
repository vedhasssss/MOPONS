const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    enum: ['approve_coupon', 'reject_coupon', 'block_user', 'unblock_user', 'delete_coupon', 'resolve_dispute', 'update_settings'],
    required: true
  },
  targetType: {
    type: String,
    enum: ['user', 'coupon', 'transaction', 'dispute'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  description: {
    type: String
  },
  ipAddress: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

adminLogSchema.index({ adminId: 1, createdAt: -1 });
adminLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AdminLog', adminLogSchema);
