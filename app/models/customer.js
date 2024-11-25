const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  tokens: {
    type: String,
    required: false,
  },
  // Add other fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema, 'customer');
