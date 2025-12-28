const express = require('express');
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  buyCoupon,
  markAsUsed
} = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getCoupons)
  .post(protect, upload.single('image'), createCoupon);

router.route('/:id')
  .get(getCoupon)
  .put(protect, upload.single('image'), updateCoupon)
  .delete(protect, deleteCoupon);

router.post('/:id/buy', protect, buyCoupon);
router.put('/:id/mark-used', protect, markAsUsed);

module.exports = router;
