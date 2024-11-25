const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    postId:{
        type: Schema.Types.ObjectId,  
        default: null, 
    },

    blocker_id:{
        type:Schema.Types.ObjectId,
        default: null, 
    },

    blockReason :{
        type :String,

    }


   

},{ timestamps: true });

module.exports = mongoose.model('postBlock', userSchema, 'postBlock');

