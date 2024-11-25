const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

fromUser:{
    type:Schema.Types.ObjectId,
default:" "
},
group_id:{
    type:Schema.Types.ObjectId,
default:" "
},
requestPending:{
    type: Boolean, 
    default: false
},

},{ timestamps: true });
module.exports = mongoose.model('requestsgroup', userSchema, 'requestsgroup');
