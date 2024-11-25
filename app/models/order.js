  const mongoose = require('mongoose');

  const orderSchema = new mongoose.Schema({
    
    order_id: {
      type: String,
    },
    payment_id: {
      type: String,
    },
    signature: {
      type: String,
    },
    amount: {
      type: Number,
    },
    isPaid: {
      type: Boolean,
    },
    currency: {
      type: String,
    },
    receipt: {
      type: String,
    },
    customer_Id: {
      type: String,
    },
    // Additional parameters
    userDetails: {
      type: Object,
    },
    razorpay_payment_id: {
      type: String,
    },
    razorpay_signature: {
      type: String,
    },

    razorpay_timestamp: {
      type: Date,
      default: Date.now, 
    },

  }, { timestamps: true });

  module.exports = mongoose.model('Order', orderSchema, 'order');
