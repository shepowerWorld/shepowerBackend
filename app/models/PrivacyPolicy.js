const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PrivacyPolicy = new Schema({

    text :{
        type :String,

    }

},{ timestamps: true });

module.exports = mongoose.model('PrivacyPolicy', PrivacyPolicy, 'PrivacyPolicy');

