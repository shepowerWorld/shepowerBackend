const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
user_id:{
    type:Schema.Types.ObjectId
},
requested_id:{
    type:Schema.Types.ObjectId
},
accpeted_id:{
    type:Schema.Types.ObjectId
},
request:{
    type:Object
},
accpeted:{
    type:Object,
},
post_id:{
    type:Schema.Types.ObjectId,
},
comment_id:{
    type:Schema.Types.ObjectId,
},
replycomment_id:{
    type:Schema.Types.ObjectId,
},
likespost:{
    type:Object,
},
likecomment:{
    type:Object,
},
taggedppl:{
    type:Object,
},
settings:{
    type:String,
},
tagged_post:{
    type:Object,
},
tagged_post_userid:{
    type:Object,
},
comment:{
    type:Object,
},
mentioned:{
    type:Object,
},
replyCommentlike:{
    type:Object,
},
replyComment:{
    type:Object,
},
post_liker_id:{
    type:Schema.Types.ObjectId,
},
post_commenter_id:{
    type:Schema.Types.ObjectId,
},
replyCommenter_id:{
    type:Schema.Types.ObjectId,
},
commente_liker_id:{
    type:Schema.Types.ObjectId,
},
replyCommente_liker_id:{
    type:Schema.Types.ObjectId,
},
mentioner_id:{
    type:Schema.Types.ObjectId,
},
grouprequest:{
    type:Object,
},
group_id:{
    type:Schema.Types.ObjectId,
},
grouprequest_id:{
    type:Schema.Types.ObjectId,
},
groupaccept_id:{
    type:Schema.Types.ObjectId,
},
groupaccept:{
    type:Object,
},
requested:{
type:Boolean
},
sosNotification:{
    type:Object,
},
sosId:{
    type:String
},
sosAccept:{
    type:Object,
},
sosClosed:{
    type:Object, 
},
closedorNot:{
    type:Object, 
},
count:{
    type:Boolean,
    default:false
 },
 viewersDetails:{
    type:[String],
    default:[]  
    
 },
    // documents expire after 172,800 seconds (2 days)


createdAt: {
    type: Date,
    default: Date.now,
    expires: 172800 
  } 
},{ timestamps: true });

module.exports = mongoose.model('notification', userSchema, 'notification');

