const mongoose = require ('mongoose');


const subCategory =  new mongoose.Schema({
    
    addIntrest_id:{
        type : mongoose.Schema.Types.ObjectId,
    },
    
    name:{
        type:String,
        unique: true,
    },
   
},{timestamps:true})

module.exports=new mongoose.model('subCategory' , subCategory)
