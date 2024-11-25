const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
  
  
  user_id: {
    type: String,
    required: true,
  }, 
  
  paymentId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  refundId: {
    type: String, 
  },
 


},{ timestamps: true });

module.exports = mongoose.model('refund', refundSchema, 'refund');




