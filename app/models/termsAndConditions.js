const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const termsAndConditions = new Schema({

    text :{
        type :String,

    }

},{ timestamps: true });

module.exports = mongoose.model('termsAndConditions', termsAndConditions, 'termsAndConditions');

