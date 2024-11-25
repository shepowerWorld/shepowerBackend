const mongoose = require('mongoose')
const weshare = mongoose.Schema({
    user_id:{
        type:String,
    },
    description :{
        type:String,
    },
    userdeatils:{
        type:Object
    }
},{timestamps: true })
module.exports = mongoose.model('weshare', weshare)