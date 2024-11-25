const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const faqSchema = new Schema({

    Question:{
        type:String,
     },

     Answer:{
        type:String,
     },

},{ timestamps: true });
module.exports = mongoose.model('faq', faqSchema, 'faq');
