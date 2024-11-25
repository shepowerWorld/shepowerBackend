const mongoose =  require ('mongoose')

const adminSchema = new mongoose.Schema({


  userName:{
type:String,
default:''
  },

  password:{
    type : String,
    max:100000000,
    default:''
  },

},{timestamps:true})

var admin = new mongoose.model('admin' ,adminSchema)
module.exports = admin;