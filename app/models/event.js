const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const eventSchema=new Schema({
    user_id:{
        type : mongoose.Schema.Types.ObjectId,
    },
    eventname :{
    type:String,

    },
    eventdescription :{
    type:String,
    },
    eventlocation :{
        type:String
    },
    eventimage :{
        type : String,
        set:(icon)=>{
            if(icon){
                        return icon  
                    }
                    return ;
                },
                default:" "
      },

    eventtime :{
    type:Date 
    },

    eventlink:{
        type :String
    },
    joineventrequest:{
        type :String
    },
    totalparticepants:{
        type :String
    },
    eventendtime:{
        type :Date  
    }
},{ timestamps: true });
module.exports=mongoose.model('events', eventSchema, 'events');
