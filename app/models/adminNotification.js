const mongoose = require('mongoose')
const notification = mongoose.Schema({
    message:{
        type:String,
    },
    title :{
        type:String,
        required:'true',
    },
    image:{
        type:String,
        default:''
    }, 
    count:{
        type:Number,
        default:''
    }  
},{timestamps: true })
module.exports = mongoose.model('adminNotification', notification)