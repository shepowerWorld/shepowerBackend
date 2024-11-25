const mongoose = require ('mongoose');


const languages =  new mongoose.Schema({
    languages:{
        type:String,
        unique: true,
    },
},{timestamps:true})

module.exports=  new mongoose.model('languages' , languages)
 
