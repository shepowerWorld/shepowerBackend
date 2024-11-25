const mongoose = require ('mongoose')
const Schema = mongoose.Schema;
const adminSchema = new Schema({

    user_id:{
        type:Schema.Types.ObjectId,
        default:''
    },

    newdevice_id:{
        type:String,
        default:''
    },
      Olddevice_id:{
        type:String,
        default:''
    },
  token:{
        type:String,
        default:''
    }
},{timestamps:true})

var admin = new mongoose.model('logoutcheck' ,adminSchema)
module.exports = admin;
