const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createGroupSchema=new Schema({
    joining_group:{
        type:Array,
    },
    room_id:{
        type:String,
        default:" "
    },
    admin_id:{
        type:Object,
        default:" "
    },
   group_profile_img:{
         type:String,
         default:" "
    },
	 groupName:{
        type:String
    },
   Groupabout:{
        type:String,
	default:""
	},
    totalrequest:{
        type:Array,
        default:[ ]
        },
        totalParticepants:{
            type:Number,
            default:" " 
        },
        totalrequestcount:{
            type:Number,
            default:" " 
        },
        adminBlock:{
            type:Boolean,
            default:false
        },
        mainadmin_id:{
            type:String,
            default:'12345678' 
        }
 },{ timestamps: true })

const CreateGroup=mongoose.model('GroupChat',createGroupSchema)
module.exports={CreateGroup}



