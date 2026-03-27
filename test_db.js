require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    // Find any sold coupon
    const sold = await Coupon.findOne({ status: 'sold' });
    if (!sold) {
      console.log('No sold coupons found');
    } else {
      console.log('Found sold coupon with ownerId:', sold.ownerId);
      
      // Now test the query
      const match = await Coupon.find({ 
        status: 'sold', 
        ownerId: sold.ownerId.toString() 
      });
      console.log('Query result count:', match.length);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
