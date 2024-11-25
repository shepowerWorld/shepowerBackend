const mongoose=require('mongoose')

const storeMsgSchema=mongoose.Schema({
    sender_id:{
        type:String,
        required:true
    },
    senderName:{
       type:String,
    },
    message:{
        type:String,
    },
    attachment:{
	type:String,
	default:''
	  },
    room_id:{
        type:String,
        required:true
    },
    
},{ timestamps: true });

module.exports=mongoose.model('storeMsg',storeMsgSchema)
