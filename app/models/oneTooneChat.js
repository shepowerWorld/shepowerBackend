const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatApplicationSchema= new Schema({
    sender_id:{
        type:Schema.Types.ObjectId,
        default:" "
    },
    other_id:{
        type:Schema.Types.ObjectId,
        default:" "
    },
    room_id:
    {
        
        type:String,
        require:true,
        unique:true
    },
    blocked: {
        type:Boolean,
        default:false
    },
    sender_idData:{
        type:Object,
    },
    other_idData:{
        type:Object,
    },
    
},{ timestamps: true });
const chatModule=mongoose.model('OnetoOneChat',chatApplicationSchema);
module.exports={chatModule}



