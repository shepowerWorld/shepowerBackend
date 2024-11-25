const mongoose = require ('mongoose');


const category =  new mongoose.Schema({
    name:{
        type:String,
        unique: true,
    },
},{timestamps:true})

module.exports=  new mongoose.model('category' , category)
 
