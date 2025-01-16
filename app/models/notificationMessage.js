const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const notificationSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  file_path: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  expires_at: { type: Date, required: true },
},{ timestamps: true });



module.exports = mongoose.model('Notification', notificationSchema);