// const mongoose = require('mongoose');

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     user_id:{
//         type:Schema.Types.ObjectId,
//         default:" "
//     },
//     Post:{
//         type:String,
//         set:(icon)=>{
//         if(icon){
//                     return icon  
//                 }
//                 return ;
//             },
//             default:" "
//     },
//    Post_discription:{
//     type:String,
//     default:''
//    },
// //    Tagged_people:{
// //     type:Array,
// //     default:[]
// //    },
//    totallikesofpost:{
//     type:Number,
//     default:''
//    },
//    totalcomments:{
//     type:Number,
//     defualt:0
//     },
//     likedpeopledata:{
//         type:Array,
//         defualt:" "
//     },
//     post_blocked:{
//         type:Array,
//         defualt:[]
//     }

// },{ timestamps: true });

// module.exports = mongoose.model('posts', userSchema, 'posts');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        default: " "
    },
    // Post: {
    //     type: String,
    //     set: (icon) => {
    //         if (icon) {
    //             return icon;
    //         }
    //         return;
    //     },
    //     default: " "
    // },

    Post: {
        type: String,
        required: true
    },


    Post_discription: {
        type: String,
        default: ''
    },
    totallikesofpost: {
        type: Number,
        default: ''
    },
    totalcomments: {
        type: Number,
        default: 0
    },
    likedpeopledata: {
        type: Array,
        default: " "
    },
    post_blocked: {
        type: Array,
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema); // Export the model correctly



