const post = require('../models/posts');
const PostBlock=require('../models/postBlock')
const leaderUsermaster=require('../models/registrationleader')
const citiZenUsermaster=require('../models/registrationcitizen')
const connection = require("../models/connection");
const comments=require('../models/comments')
const replycomments=require('../models/replycomment');
const notification=require('../models/notification')
const RatingsReviews = require('../models/ratingsReviews')
const likespost=require('../models/likespost')
const mongoose=require('mongoose')

exports.createPost = async (req, res) => {
  try {
      if (!req.body.user_id && !req.files) {
          return res.status(400).json({ Status: false, message: 'please select image' });
      } else if (req.files && req.files.length > 0) {
          const user_id = req.body.user_id;
          const posts = req.files.map(file => file.filename); // Changed variable name to 'posts'
          const postDocuments = posts.map(p => new post({ // Changed variable name to 'postDocuments'
              user_id,
              Post: p,
          }));
          const response = await post.insertMany(postDocuments); // Use 'Post' to reference the model
          if (response) {
              return res.status(200).json({ Status: true, message: 'post created successfully', response });
          } else {
              return res.status(400).json({ Status: false, message: 'could not create successfully' });
          }
      } else {
          return res.status(400).json({ Status: false, message: 'please select file' });
      }
  } catch (err) {
      console.error(err);
      return res.status(400).json({ Status: 'Error', Error: err });
  }
}



exports.editPostDetails=async(req,res)=>{
  try{
  const {post_id,Post_discription}=req.body  
  if(post_id&&Post_discription){
  const respons=await post.findOneAndUpdate({_id:post_id},{$set:{Post_discription:Post_discription}})
  if(respons){  
  const response=await post.findOne({_id:post_id})
    res.status(200).json({status:true,message:'Post edited Successfully',response})
  }else{
    return res.status(400).json({Status:false,message:'could not update details'})
  }
  }else{
      return res.status(400).json({Status:false,message:'could not update details'})
    }
    
  }catch(err){
    
       return res.status(400).json({Status:'Error',Error})
    }
}
// exports.getPostsOfAll = async (req, res) => {
//     try {
//       const { user_id, offset } = req.body;
//       const limit=5
//       const user_ids=new mongoose.Types.ObjectId(user_id)
//       const seeinconnections=await connection.find({'connections._id':user_ids},{_id:0,user_id:1})
//       const user_ids_array = seeinconnections.map(connection => connection.user_id);
//       const users = await leaderUsermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
//       const users1 = await citiZenUsermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
//       const user_id_strings = users.map(user => user._id); // Assuming _id is an ObjectId
//       const user1_id_strings = users1.map(user => user._id); // Assuming _id is an ObjectId
      
//       // Combine the arrays
//       const combinedUserIds = [...user_id_strings, ...user1_id_strings];
//       const usersWithPostss= await leaderUsermaster.aggregate([
//         {
//           $match: {
//             private: { $ne: true },
//             connected: { $ne: true },
//           }
//         },
//         {
//           $lookup: {
//             from: 'posts',
//             localField: '_id',
//             foreignField: 'user_id',
//             as: 'feed',
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             firstname:1,
//             profile_img:1,
//             profileID:1,
//             'feed.Post': 1,
//             'feed.user_id': 1,
//             'feed.Post_discription':1,
//             'feed._id':1,
//             'feed.totallikesofpost':1,
//             'feed.totalcomments':1,
//             'feed.likedpeopledata':1,
//             'feed.createdAt': 1,
//           },
//         },
//         {
//           $sort: {
//             'feed.createdAt': -1, 
//           },
//         },
//       ]);
//       const usersWithPosts= await leaderUsermaster.aggregate([
//         {
//           $match: {
//            _id:{$in:combinedUserIds},
//            private: { $ne: true },
//             public:{$ne:true}
//           }
//         },
//         {
//           $lookup: {
//             from: 'posts',
//             localField: '_id',
//             foreignField: 'user_id',
//             as: 'feed',
//           },
//         },  
//         {
//           $project: {
//             _id: 1,
//             firstname:1,
//             profile_img:1,
//             profileID:1,
//             'feed.Post': 1,
//             'feed.user_id': 1,
//             'feed.Post_discription':1,
//             'feed._id':1,
//             'feed.totallikesofpost':1,
//             'feed.totalcomments':1,
//             'feed.likedpeopledata':1,
//             'feed.createdAt': 1,
//           },
//         },
//         {
//           $sort: {
//             'feed.createdAt': -1,
//           },
//         },
//       ]);
//       const usersWithPostss1= await citiZenUsermaster.aggregate([
//         {
//           $match: {
//             private: { $ne: true },
//             connected: { $ne: true },
//           }
//         },
//         {
//           $lookup: {
//             from: 'posts',
//             localField: '_id',
//             foreignField: 'user_id',
//             as: 'feed',
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             firstname:1,
//             profile_img:1,
//             profileID:1,
//             'feed.Post': 1,
//             'feed.user_id': 1,
//             'feed.Post_discription':1,
//             'feed._id':1,
//             'feed.totallikesofpost':1,
//             'feed.totalcomments':1,
//             'feed.likedpeopledata':1,
//             'feed.createdAt': 1,
//           },
//         },
//         {
//           $sort: {
//             'feed.createdAt': -1, 
//           },
//         },
//       ]);
//       const usersWithPosts1= await citiZenUsermaster.aggregate([
//         {
//           $match: {
//            _id:{$in:combinedUserIds},
//            private: { $ne: true },
          
//           }
//         },
//         {
//           $lookup: {
//             from: 'posts',
//             localField: '_id',
//             foreignField: 'user_id',
//             as: 'feed',
//           },
//         },
//         {
//           $project: {
//             _id: 1,
//             name:1,
//             profile_img:1,
//             profileID:1,
//             'feed.Post': 1,
//             'feed.user_id': 1,
//             'feed.Post_discription':1,
//             'feed._id':1,
//             'feed.totallikesofpost':1,
//             'feed.totalcomments':1,
//             'feed.likedpeopledata':1,
//             'feed.createdAt': 1,
//           },
//         },
//         {
//           $sort: {
//             'feed.createdAt': -1,
//           },
//         },
//       ]);
      
//       const mergedUsersWithPosts = [
//         ...usersWithPosts,
//         ...usersWithPostss,
//         ...usersWithPosts1,
//         ...usersWithPostss1,
//       ];
      
//       const filteredUsersWithPosts = mergedUsersWithPosts.filter(user => user.feed.length > 0);

// // Optionally, you can sort the combined result based on 'createdAt'
// filteredUsersWithPosts.sort((a, b) => b.feed[0].createdAt - a.feed[0].createdAt);

// // Now, filteredUsersWithPosts contains the combined and filtered result
// console.log(filteredUsersWithPosts);
    
//       const startIndex = offset || 0;
//       const endIndex = startIndex + (limit || filteredUsersWithPosts.length); // If limit is not provided, return all remaining posts
  
//       const paginatedUsersWithPosts = filteredUsersWithPosts.slice(startIndex, endIndex);
  
//       return res.status(200).json({ Status: true, message: 'Posts fetched successfully', UsersWithPosts: paginatedUsersWithPosts });
     
//     }catch (err) {
//       console.log(err)
//       return res.status(400).json({ Status: 'Error', Error: err });
//     }
//   };

// exports.getPostsOfAll = async (req, res) => {
//   try {
//     const { user_id, offset } = req.body;
//     const limit=5
//     const user_ids=new mongoose.Types.ObjectId(user_id)
//     const seeinconnections=await connection.find({'connections._id':user_ids},{_id:0,user_id:1})
//     const user_ids_array = seeinconnections.map(connection => connection.user_id);
//     const users = await leaderUsermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
//     const users1 = await citiZenUsermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
//     const user_id_strings = users.map(user => user._id); // Assuming _id is an ObjectId
//     const user1_id_strings = users1.map(user => user._id); // Assuming _id is an ObjectId
    
//     // Combine the arrays
//     const combinedUserIds = [...user_id_strings, ...user1_id_strings];
//     const usersWithPostss= await leaderUsermaster.aggregate([
//       {
//         $match: {
//           private: { $ne: true },
//           connected: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.createdAt': 1,
//           'feed.post_blocked': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1, 
//         },
//       },
//     ]);
//     const usersWithPosts= await leaderUsermaster.aggregate([
//       {
//         $match: {
//          _id:{$in:combinedUserIds},
//          private: { $ne: true },
//           public:{$ne:true}
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },  
//       {
//         $project: {
//           _id: 1,
//           firstname:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.createdAt': 1,
//           'feed.post_blocked': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//     ]);
//     const usersWithPostss1= await citiZenUsermaster.aggregate([
//       {
//         $match: {
//           private: { $ne: true },
//           connected: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.post_blocked': 1,
//           'feed.createdAt': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1, 
//         },
//       },
//     ]);
//     const usersWithPosts1= await citiZenUsermaster.aggregate([
//       {
//         $match: {
//          _id:{$in:combinedUserIds},
//          private: { $ne: true },
        
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.post_blocked': 1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.createdAt': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//     ]);
    
//     const mergedUsersWithPosts = [
//       ...usersWithPosts,
//       ...usersWithPostss,
//       ...usersWithPosts1,
//       ...usersWithPostss1,
//     ];

//     console.log("mergedUsersWithPosts------", mergedUsersWithPosts);
    
//     let filteredUsersWithPosts = mergedUsersWithPosts.map(user => {
//       user.feed = user.feed.filter(post => !post.post_blocked.includes(user_id));
//       return user;
//     });
    
//     console.log("mergedUsersWithPosts-2-----", mergedUsersWithPosts);
//     console.log("filteredUsersWithPosts01===---", filteredUsersWithPosts);
    
//     filteredUsersWithPosts = mergedUsersWithPosts.filter(user => user.feed.length > 0);
    
//     console.log("filteredUsersWithPosts0 2===----", filteredUsersWithPosts);
//     // Optionally, you can sort the combined result based on 'createdAt'
//     filteredUsersWithPosts.sort((a, b) => b.feed[0].createdAt - a.feed[0].createdAt);
//     console.log("filteredUsersWithPosts0 3===----", filteredUsersWithPosts);

// // Now, filteredUsersWithPosts contains the combined and filtered result
// console.log(filteredUsersWithPosts);
  
//     const startIndex = offset || 0;
//     const endIndex = startIndex + (limit || filteredUsersWithPosts.length); // If limit is not provided, return all remaining posts

//     const paginatedUsersWithPosts = filteredUsersWithPosts.slice(startIndex, endIndex);

//     return res.status(200).json({ Status: true, message: 'Posts fetched successfully', UsersWithPosts: paginatedUsersWithPosts });
   
//   }catch (err) {
//     console.log(err)
//     return res.status(400).json({ Status: 'Error', Error: err });
//   }
// };


exports.deletePost=async(req,res)=>{
    try{
  const {_id}=req.body
  const response=await post.findOne({_id:_id})
  if(response){
    const data1=await likespost.deleteMany({post_id:_id})
    const data2=await comments.deleteMany({post_id:_id})
    const data3=await replycomments.deleteMany({post_id:_id})
    const data4=await notification.deleteMany({post_id:_id})
    if(data1&&data2&&data3&&data4){
      const response=await post.findOneAndDelete({_id:_id})
      return res.status(200).json({Status:true,message:'post Deleted successfully',response})
    }else{
      return res.status(400).json({Status:false,message:'error deleting the post'})
    }
  }else{
    return res.status(400).json({Status:false,message:'error fechting the post'})
  }
  }catch(err){
console.log(err)
    return res.status(400).json({Status:'Error',Error})
  }
  }
exports.getAllPostsofMe=async(req,res)=>{
    try{
         const{user_id}=req.body

        const ids=await citiZenUsermaster.findOne({_id:user_id})
        const id =ids || await leaderUsermaster.findOne({_id:user_id})
       const results1= await citiZenUsermaster.aggregate([
        {
          $match: {
            _id: id._id
          }
        },
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'user_id',
            as: 'posts',
          },
        },
        {
          $project: {
            _id: 0,
            firstname:1,
            profile_img:1,
            profileID:1,
            'posts.Post': 1,
          'posts.Post_discription':1,
          'posts._id':1,
          'posts.totallikesofpost':1,
          'posts.totalcomments':1,
          'posts.likedpeopledata':1
            
          },
        },
      ]);
      const results2= await leaderUsermaster.aggregate([
        {
          $match: {
            _id: id._id
          }
        },
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'user_id',
            as: 'posts',
          },
        },
        {
          $project: {
            _id: 0,
            firstname:1,
            profile_img:1,
            profileID:1,
            'posts.Post': 1,
          'posts.Post_discription':1,
          'posts._id':1,
          'posts.totallikesofpost':1,
          'posts.totalcomments':1,
          'posts.likedpeopledata':1
            
          },
        },
      ]);
          const results=results1.concat(results2)
          if(results){
        return res.status(200).json({Status:true,message:'post fetched successfully',results})
          }else{
            return res.status(400).json({Status:false,message:'error fechting the file'})
          }
    }catch(err){
        
         return res.status(400).json({Status:'Error',Error})
      }
}


exports.postBlock = async (req,res)=>{  
try{

 const postId = req.body.postId ;
 const {blocker_id , blockReason} = req.body;
if(!postId){
  return res.status(404).json({  status:false,message: 'please select a post' });
}

const existingBlock = await PostBlock.findOne({ postId, blocker_id });

if (!existingBlock) {
  const postsBlocks = new PostBlock({
    postId,
    blocker_id,
    blockReason,
});

const response = await postsBlocks.save();
if(response){
  let blockPost = await post.findOneAndUpdate({_id: postId}, {$push:{post_blocked:blocker_id}})
  console.log("blockPost--", blockPost);
}
return res.status(200).json({ message: 'Post blocked successfully', response });
}else{
  return res.status(404).json({ message: 'Post is already blocked' });
}
}catch (error){

  console.log(error);
  return res.status(500).json({status:'eroor', message: 'Internal server error' });
}
}


// exports.postBlock = async (req,res)=>{ 

//   try {
//     const { blocker_id , blockReason } = req.body; // The user who wants to block the post
//     const { postId } = req.body; // The post to be blocked

//     const post = await PostBlock.findById(postId);

//     if (!post) {
//       console.log(post);
//         return res.status(404).json({ status: false, message: 'Post not found' });
//     }

//     if (post.blocker_id && post.blocker_id.toString() === blocker_id) {
//         return res.status(400).json({ status: false, message: "You can't block your own post" });
//     }

//     // if (post.blockedBy.includes(blocker_id)) {
//     //     return res.status(400).json({ status: false, message: 'Post is already blocked by this user' });
//     // }

//     // post.blockedBy.push(blocker_id);
//     // post.blockReason = blockReason; 
//     // post.postId = postId; 
//     // await post.save(); 
//     post.blocker_id = blocker_id;
//     post.blockReason = blockReason;
//     await post.save();


//     return res.status(200).json({ status: true, message: 'Post blocked successfully' });
// } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: false, message: 'Internal server error' });
// }

// }

// exports.postBlock = async (req, res) => {
//   try {
//     const { blocker_id, blockReason, postId } = req.body;

//     // Check if the post exists
   
//     if (!post) {
//       return res.status(404).json({ status: false, message: 'Post not found' });
//     }

//     const post = await PostBlock.findById(postId);


//     // Check if the post is already blocked by the same user
//     const existingBlock = await PostBlock.findOne({ postId, blocker_id });

//     if (existingBlock) {
//       return res.status(400).json({ status: false, message: 'Post is already blocked by this user' });
//     }

//     // Create a new block entry in the PostBlock collection
//     const block = new PostBlock({
//       postId,
//       blocker_id,
//       blockReason,
//     });

//     await block.save();

//     // Update the Post document to exclude it from the user's feed
//     PostBlock.blockedBy.push(blocker_id);
//     await post.save();

//     return res.status(200).json({ status: true, message: 'Post blocked successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ status: false, message: 'Internal server error' });
//   }
// };



// exports.getPostsOfAll = async (req, res) => {
//   try {
//     const { user_id, offset } = req.body;
//     const limit=5
//     const user_ids=new mongoose.Types.ObjectId(user_id)
//     const seeinconnections=await connection.find({'connections._id':user_ids},{_id:0,user_id:1})
//     const user_ids_array = seeinconnections.map(connection => connection.user_id);
//     const users = await leaderUsermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
//     const users1 = await citiZenUsermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
//     const user_id_strings = users.map(user => user._id); // Assuming _id is an ObjectId
//     const user1_id_strings = users1.map(user => user._id); // Assuming _id is an ObjectId
    
//     // Combine the arrays
//     const combinedUserIds = [...user_id_strings, ...user1_id_strings];
//     const usersWithPostss= await leaderUsermaster.aggregate([
//       {
//         $match: {
//           private: { $ne: true },
//           connected: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $lookup: {
//           from: 'RatingsReviews',
//           localField: '_id',
//           foreignField: 'leader_id',
//           as: 'ratings',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.createdAt': 1,
//           'feed.post_blocked': 1,
//           ratings: {
//             $cond: { if: { $isArray: "$ratings" }, then: { $avg: "$ratings.ratings" }, else: null }
//           }
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1, 
//         },
//       },
//     ]);
//     const usersWithPosts= await leaderUsermaster.aggregate([
//       {
//         $match: {
//          _id:{$in:combinedUserIds},
//          private: { $ne: true },
//           public:{$ne:true}
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $lookup: {
//           from: 'RatingsReviews',
//           localField: '_id',
//           foreignField: 'leader_id',
//           as: 'ratings',
//         },
//       },  
//       {
//         $project: {
//           _id: 1,
//           firstname:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.createdAt': 1,
//           'feed.post_blocked': 1,
//           ratings: {
//             $cond: { if: { $isArray: "$ratings" }, then: { $avg: "$ratings.ratings" }, else: null }
//           }
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//     ]);
//     const usersWithPostss1= await citiZenUsermaster.aggregate([
//       {
//         $match: {
//           private: { $ne: true },
//           connected: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.post_blocked': 1,
//           'feed.createdAt': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1, 
//         },
//       },
//     ]);
//     const usersWithPosts1= await citiZenUsermaster.aggregate([
//       {
//         $match: {
//          _id:{$in:combinedUserIds},
//          private: { $ne: true },
        
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.post_blocked': 1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.createdAt': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//     ]);
    
//     const mergedUsersWithPosts = [
//       ...usersWithPosts,
//       ...usersWithPostss,
//       ...usersWithPosts1,
//       ...usersWithPostss1,
//     ];

//     console.log("mergedUsersWithPosts------", mergedUsersWithPosts);
    
//     let filteredUsersWithPosts = mergedUsersWithPosts.map(user => {
//       user.feed = user.feed.filter(post => !post.post_blocked.includes(user_id));
//       return user;
//     });
    
//     console.log("mergedUsersWithPosts-2-----", mergedUsersWithPosts);
//     console.log("filteredUsersWithPosts01===---", filteredUsersWithPosts);
    
//     filteredUsersWithPosts = mergedUsersWithPosts.filter(user => user.feed.length > 0);
    
//     console.log("filteredUsersWithPosts0 2===----", filteredUsersWithPosts);
//     // Optionally, you can sort the combined result based on 'createdAt'
//     filteredUsersWithPosts.sort((a, b) => b.feed[0].createdAt - a.feed[0].createdAt);
//     console.log("filteredUsersWithPosts0 3===----", filteredUsersWithPosts);

// // Now, filteredUsersWithPosts contains the combined and filtered result
// console.log(filteredUsersWithPosts);
  
//     const startIndex = offset || 0;
//     const endIndex = startIndex + (limit || filteredUsersWithPosts.length); // If limit is not provided, return all remaining posts

//     const paginatedUsersWithPosts = filteredUsersWithPosts.slice(startIndex, endIndex);

//     return res.status(200).json({ Status: true, message: 'Posts fetched successfully', UsersWithPosts: paginatedUsersWithPosts });
   
//   }catch (err) {
//     console.log(err)
//     return res.status(400).json({ Status: 'Error', Error: err });
//   }
// };

// exports.getPostsOfAll = async (req, res) => {
//   try {
//     const { user_id, offset } = req.body;
//     const limit = 5;
//     const user_ids = new mongoose.Types.ObjectId(user_id);
//     const seeinconnections = await connection.find({ 'connections._id': user_ids }, { _id: 0, user_id: 1 });
//     const user_ids_array = seeinconnections.map(connection => connection.user_id);
//     const users = await leaderUsermaster.find({ _id: { $in: user_ids_array }, connected: true }, { _id: 1 });
//     const users1 = await citiZenUsermaster.find({ _id: { $in: user_ids_array }, connected: true }, { _id: 1 });
//     const user_id_strings = users.map(user => user._id); // Assuming _id is an ObjectId
//     const user1_id_strings = users1.map(user => user._id); // Assuming _id is an ObjectId

//     // Combine the arrays
//     const combinedUserIds = [...user_id_strings, ...user1_id_strings];
//     const usersWithPosts = await leaderUsermaster.aggregate([
//       {
//         $match: {
//           private: { $ne: true },
//           connected: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $lookup: {
//           from: 'RatingsReviews',
//           localField: '_id',
//           foreignField: 'leader_id',
//           as: 'ratings',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname: 1,
//           profile_img: 1,
//           profileID: 1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription': 1,
//           'feed._id': 1,
//           'feed.totallikesofpost': 1,
//           'feed.totalcomments': 1,
//           'feed.likedpeopledata': 1,
//           'feed.createdAt': 1,
//           'feed.post_blocked': 1,
//           ratings: {
//             $cond: { if: { $isArray: "$ratings" }, then: { $avg: "$ratings.ratings" }, else: null }
//           }
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//     ]);

//     const usersWithPosts1 = await leaderUsermaster.aggregate([
//       {
//         $match: {
//           _id: { $in: combinedUserIds },
//           private: { $ne: true },
//           public: { $ne: true }
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $lookup: {
//           from: 'RatingsReviews',
//           localField: '_id',
//           foreignField: 'leader_id',
//           as: 'ratings',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname: 1,
//           profile_img: 1,
//           profileID: 1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription': 1,
//           'feed._id': 1,
//           'feed.totallikesofpost': 1,
//           'feed.totalcomments': 1,
//           'feed.likedpeopledata': 1,
//           'feed.createdAt': 1,
//           'feed.post_blocked': 1,
//           ratings: {
//             $cond: { if: { $isArray: "$ratings" }, then: { $avg: "$ratings.ratings" }, else: null }
//           }
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//     ]);

//     const usersWithPosts2 = await citiZenUsermaster.aggregate([
//       {
//         $match: {
//           private: { $ne: true },
//           connected: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname: 1,
//           profile_img: 1,
//           profileID: 1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription': 1,
//           'feed._id': 1,
//           'feed.totallikesofpost': 1,
//           'feed.totalcomments': 1,
//           'feed.likedpeopledata': 1,
//           'feed.post_blocked': 1,
//           'feed.createdAt': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//     ]);

//     const usersWithPosts3 = await citiZenUsermaster.aggregate([
//       {
//         $match: {
//           _id: { $in: combinedUserIds },
//           private: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           profile_img: 1,
//           profileID: 1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription': 1,
//           'feed._id': 1,
//           'feed.totallikesofpost': 1,
//           'feed.post_blocked': 1,
//           'feed.totalcomments': 1,
//           'feed.likedpeopledata': 1,
//           'feed.createdAt': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//     ]);

//     const mergedUsersWithPosts = [
//       ...usersWithPosts,
//       ...usersWithPosts1,
//       ...usersWithPosts2,
//       ...usersWithPosts3,
//     ];

//     let paginatedUsersWithPosts = [];
//     mergedUsersWithPosts.forEach(user => {
//       user.feed.forEach(post => {
//         paginatedUsersWithPosts.push({
//           _id: user._id,
//           firstname: user.firstname,
//           profile_img: user.profile_img,
//           profileID: user.profileID,
//           feed: [post],
//           ratings: user.ratings
//         });
//       });
//     });

//     return res.status(200).json({ Status: true, message: 'Posts fetched successfully', UsersWithPosts: paginatedUsersWithPosts });

//   } catch (err) {
//     console.log(err)
//     return res.status(400).json({ Status: 'Error', Error: err });
//   }
// };

// workinh in this below code get
// exports.getPostsOfAll = async (req, res) => {
//   try {
//     const { user_id, offset } = req.body;
//     const limit=5
//     const user_ids=new mongoose.Types.ObjectId(user_id)
//     const seeinconnections=await connection.find({'connections._id':user_ids},{_id:0,user_id:1})
//     const user_ids_array = seeinconnections.map(connection => connection.user_id);
//     const users = await leaderUsermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
//     const users1 = await citiZenUsermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
//     const user_id_strings = users.map(user => user._id); // Assuming _id is an ObjectId
//     const user1_id_strings = users1.map(user => user._id); // Assuming _id is an ObjectId
    
//     // Combine the arrays
//     const combinedUserIds = [...user_id_strings, ...user1_id_strings];
//     const usersWithPostss= await leaderUsermaster.aggregate([
//       {
//         $match: {
//           private: { $ne: true },
//           connected: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.createdAt': 1,
//           'feed.post_blocked': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1, 
//         },
//       },
//     ]);
//     const usersWithPosts= await leaderUsermaster.aggregate([
//       {
//         $match: {
//          _id:{$in:combinedUserIds},
//          private: { $ne: true },
//           public:{$ne:true}
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },  
//       {
//         $project: {
//           _id: 1,
//           firstname:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.createdAt': 1,
//           'feed.post_blocked': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//     ]);
//     const usersWithPostss1= await citiZenUsermaster.aggregate([
//       {
//         $match: {
//           private: { $ne: true },
//           connected: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.post_blocked': 1,
//           'feed.createdAt': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1, 
//         },
//       },
//     ]);
//     const usersWithPosts1= await citiZenUsermaster.aggregate([
//       {
//         $match: {
//          _id:{$in:combinedUserIds},
//          private: { $ne: true },
        
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           name:1,
//           profile_img:1,
//           profileID:1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription':1,
//           'feed._id':1,
//           'feed.totallikesofpost':1,
//           'feed.post_blocked': 1,
//           'feed.totalcomments':1,
//           'feed.likedpeopledata':1,
//           'feed.createdAt': 1,
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//     ]);
    
//     const mergedUsersWithPosts = [
//       ...usersWithPosts,
//       ...usersWithPostss,
//       ...usersWithPosts1,
//       ...usersWithPostss1,
//     ];

//     console.log("mergedUsersWithPosts------", mergedUsersWithPosts);
    
//     let filteredUsersWithPosts = mergedUsersWithPosts.map(user => {
//       user.feed = user.feed.filter(post => !post.post_blocked.includes(user_id));
//       return user;
//     });
    
//     console.log("mergedUsersWithPosts-2-----", mergedUsersWithPosts);
//     console.log("filteredUsersWithPosts01===---", filteredUsersWithPosts);
    
//     filteredUsersWithPosts = mergedUsersWithPosts.filter(user => user.feed.length > 0);
    
//     console.log("filteredUsersWithPosts0 2===----", filteredUsersWithPosts);
//     // Optionally, you can sort the combined result based on 'createdAt'
//     filteredUsersWithPosts.sort((a, b) => b.feed[0].createdAt - a.feed[0].createdAt);
//     console.log("filteredUsersWithPosts0 3===----", filteredUsersWithPosts);

// // Now, filteredUsersWithPosts contains the combined and filtered result
// console.log(filteredUsersWithPosts);
  
//     const startIndex = offset || 0;
//     const endIndex = startIndex + (limit || filteredUsersWithPosts.length); // If limit is not provided, return all remaining posts

//     const paginatedUsersWithPosts = filteredUsersWithPosts.slice(startIndex, endIndex);

//     return res.status(200).json({ Status: true, message: 'Posts fetched successfully', UsersWithPosts: paginatedUsersWithPosts });
   
//   }catch (err) {
//     console.log(err)
//     return res.status(400).json({ Status: 'Error', Error: err });
//   }
// };

exports.getPostsOfAll = async (req, res) => {
  try {
    const { user_id, offset } = req.body;
    const limit=5
    const user_ids=new mongoose.Types.ObjectId(user_id)
    const seeinconnections=await connection.find({'connections._id':user_ids},{_id:0,user_id:1})
    const user_ids_array = seeinconnections.map(connection => connection.user_id);
    const users = await leaderUsermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
    const users1 = await citiZenUsermaster.find({ _id: { $in: user_ids_array },connected:true },{_id:1});
    const user_id_strings = users.map(user => user._id); // Assuming _id is an ObjectId
    const user1_id_strings = users1.map(user => user._id); // Assuming _id is an ObjectId
    
    // Combine the arrays
    const combinedUserIds = [...user_id_strings, ...user1_id_strings];
    const usersWithPostss= await leaderUsermaster.aggregate([
      {
        $match: {
          private: { $ne: true },
          connected: { $ne: true },
        }
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user_id',
          as: 'feed',
        },
      },
      {
                $lookup: {
                  from: 'RatingsReviews',
                  localField: '_id',
                  foreignField: 'leader_id',
                  as: 'ratings',
                },
              },
      {
        $project: {
          _id: 1,
          firstname:1,
          profile_img:1,
          profileID:1,
          'feed.Post': 1,
          'feed.user_id': 1,
          'feed.Post_discription':1,
          'feed._id':1,
          'feed.totallikesofpost':1,
          'feed.totalcomments':1,
          'feed.likedpeopledata':1,
          'feed.createdAt': 1,
          'feed.post_blocked': 1,
          ratings: {
                        $cond: { if: { $isArray: "$ratings" }, then: { $avg: "$ratings.ratings" }, else: null }
                      }
        },
      },
      {
        $sort: {
          'feed.createdAt': -1, 
        },
      },
    ]);
    const usersWithPosts= await leaderUsermaster.aggregate([
      {
        $match: {
         _id:{$in:combinedUserIds},
         private: { $ne: true },
          public:{$ne:true}
        }
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user_id',
          as: 'feed',
        },
      },  
      {
        $lookup: {
          from: 'RatingsReviews',
          localField: '_id',
          foreignField: 'leader_id',
          as: 'ratings',
        },
      },
      {
        $project: {
          _id: 1,
          firstname:1,
          profile_img:1,
          profileID:1,
          'feed.Post': 1,
          'feed.user_id': 1,
          'feed.Post_discription':1,
          'feed._id':1,
          'feed.totallikesofpost':1,
          'feed.totalcomments':1,
          'feed.likedpeopledata':1,
          'feed.createdAt': 1,
          'feed.post_blocked': 1,
          ratings: {
            $cond: { if: { $isArray: "$ratings" }, then: { $avg: "$ratings.ratings" }, else: null }
          }
        },
      },
      {
        $sort: {
          'feed.createdAt': -1,
        },
      },
    ]);
    const usersWithPostss1= await citiZenUsermaster.aggregate([
      {
        $match: {
          private: { $ne: true },
          connected: { $ne: true },
        }
      },
   
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user_id',
          as: 'feed',
        },
      },
      {
        $lookup: {
          from: 'RatingsReviews',
          localField: '_id',
          foreignField: 'leader_id',
          as: 'ratings',
        },
      },
      {
        $project: {
          _id: 1,
          firstname:1,
          profile_img:1,
          profileID:1,
          'feed.Post': 1,
          'feed.user_id': 1,
          'feed.Post_discription':1,
          'feed._id':1,
          'feed.totallikesofpost':1,
          'feed.totalcomments':1,
          'feed.likedpeopledata':1,
          'feed.post_blocked': 1,
          'feed.createdAt': 1, 
          ratings: {
                        $cond: { if: { $isArray: "$ratings" }, then: { $avg: "$ratings.ratings" }, else: null }
                      }
                    },
                  },
      {
        $sort: {
          'feed.createdAt': -1, 
        },
      },
    ]);
    const usersWithPosts1= await citiZenUsermaster.aggregate([
      {
        $match: {
         _id:{$in:combinedUserIds},
         private: { $ne: true },
        
        }
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user_id',
          as: 'feed',
        },
      },
      {
        $project: {
          _id: 1,
          name:1,
          profile_img:1,
          profileID:1,
          'feed.Post': 1,
          'feed.user_id': 1,
          'feed.Post_discription':1,
          'feed._id':1,
          'feed.totallikesofpost':1,
          'feed.post_blocked': 1,
          'feed.totalcomments':1,
          'feed.likedpeopledata':1,
          'feed.createdAt': 1,
        },
      },
      {
        $sort: {
          'feed.createdAt': -1,
        },
      },
    ]);
    
    const mergedUsersWithPosts = [
      ...usersWithPosts,
      ...usersWithPostss,
      ...usersWithPosts1,
      ...usersWithPostss1,
    ];

    console.log("mergedUsersWithPosts------", mergedUsersWithPosts);
    
    let filteredUsersWithPosts = mergedUsersWithPosts.map(user => {
      user.feed = user.feed.filter(post => !post.post_blocked.includes(user_id));
      return user;
    });
    
    console.log("mergedUsersWithPosts-2-----", mergedUsersWithPosts);
    console.log("filteredUsersWithPosts01===---", filteredUsersWithPosts);
    
    filteredUsersWithPosts = mergedUsersWithPosts.filter(user => user.feed.length > 0);
    
    console.log("filteredUsersWithPosts0 2===----", filteredUsersWithPosts);
    // Optionally, you can sort the combined result based on 'createdAt'
    filteredUsersWithPosts.sort((a, b) => b.feed[0].createdAt - a.feed[0].createdAt);
    console.log("filteredUsersWithPosts0 3===----", filteredUsersWithPosts);

// Now, filteredUsersWithPosts contains the combined and filtered result
console.log(filteredUsersWithPosts);
  
    const startIndex = offset || 0;
    const endIndex = startIndex + (limit || filteredUsersWithPosts.length); // If limit is not provided, return all remaining posts

    const paginatedUsersWithPosts = filteredUsersWithPosts.slice(startIndex, endIndex);

    return res.status(200).json({ Status: true, message: 'Posts fetched successfully', UsersWithPosts: paginatedUsersWithPosts });
   
  }catch (err) {
    console.log(err)
    return res.status(400).json({ Status: 'Error', Error: err });
  }
};

// exports.getPostsOfAll = async (req, res) => {
//   try {
//     const { user_id, offset } = req.body;
//     const limit = 5;

//     console.log("User ID:", user_id);

//     // Find connections for the user
//     const connections = await connection.find({ 'connections._id':new mongoose.Types.ObjectId(user_id) }, { _id: 0, user_id: 1 });
//     console.log("Connections:", connections);

//     const user_ids_array = connections.map(connection => connection.user_id);

//     // Find posts from both leaderUsermaster and citiZenUsermaster collections
//     const postsFromLeaders = await leaderUsermaster.aggregate([
//       {
//         $match: {
//           _id: { $in: user_ids_array },
//           private: { $ne: true },
//           connected: { $ne: true }
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed'
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname: 1,
//           profile_img: 1,
//           profileID: 1,
//           feed: 1
//         }
//       }
//     ]);
//     console.log("Posts from Leaders:", postsFromLeaders);

//     const postsFromCitizens = await citiZenUsermaster.aggregate([
//       {
//         $match: {
//           _id: { $in: user_ids_array },
//           private: { $ne: true },
//           connected: { $ne: true }
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed'
//         }
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname: 1,
//           profile_img: 1,
//           profileID: 1,
//           feed: 1
//         }
//       }
//     ]);
//     console.log("Posts from Citizens:", postsFromCitizens);

//     // Merge posts from both collections
//     const allPosts = [...postsFromLeaders, ...postsFromCitizens];
//     console.log("All Posts:", allPosts);

//     // Sort posts by createdAt field in descending order
//     allPosts.sort((a, b) => {
//       const createdAtA = a.feed.length > 0 ? new Date(a.feed[0].createdAt) : new Date(0);
//       const createdAtB = b.feed.length > 0 ? new Date(b.feed[0].createdAt) : new Date(0);
//       return createdAtB - createdAtA;
//     });

//     // Pagination
//     const startIndex = offset || 0;
//     const endIndex = Math.min(startIndex + limit, allPosts.length);
//     const paginatedPosts = allPosts.slice(startIndex, endIndex);

//     return res.status(200).json({ Status: true, message: 'Posts fetched successfully', UsersWithPosts: paginatedPosts });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ Status: false, message: 'Error fetching posts', error: err });
//   }
// };



// exports.getPostsOfAll = async (req, res) => {
//   try {
//     const { user_id, offset } = req.body;
//     const limit = 5;
//     const userObjectId = new mongoose.Types.ObjectId(user_id);

//     // Find connections for the user
//     const seeinconnections = await connection.find({ 'connections._id': userObjectId }, { _id: 0, user_id: 1 });
//     console.log("connection data==>", seeinconnections);
//     const user_ids_array = seeinconnections.map(connection => connection.user_id);

//     // Find users from both leaderUsermaster and citiZenUsermaster collections
//     const users = await leaderUsermaster.find({ _id: { $in: user_ids_array }, connected: true }, { _id: 1 });
//     const users1 = await citiZenUsermaster.find({ _id: { $in: user_ids_array }, connected: true }, { _id: 1 });

//     // Extract user IDs from the users
//     const user_id_strings = users.map(user => user._id);
//     const user1_id_strings = users1.map(user => user._id);

//     // Combine the arrays of user IDs
//     const combinedUserIds = [...user_id_strings, ...user1_id_strings];
//    console.log("all-users==>",combinedUserIds);

//     // Aggregate posts from leaderUsermaster
//     const usersWithPosts = await leaderUsermaster.aggregate([
//       {
//         $match: {
//           _id: { $in: combinedUserIds },
//           private: { $ne: true },
//           connected: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $lookup: {
//           from: 'RatingsReviews',
//           localField: '_id',
//           foreignField: 'leader_id',
//           as: 'ratings',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname: 1,
//           profile_img: 1,
//           profileID: 1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription': 1,
//           'feed._id': 1,
//           'feed.totallikesofpost': 1,
//           'feed.totalcomments': 1,
//           'feed.likedpeopledata': 1,
//           'feed.createdAt': 1,
//           'feed.post_blocked': 1,
//           ratings: {
//             $cond: { if: { $isArray: "$ratings" }, then: { $avg: "$ratings.ratings" }, else: null }
//           }
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//       {
//         $limit: limit
//       }
//     ]);

//     console.log("usersWithPosts===>", usersWithPosts);
    
//     // Aggregate posts from citiZenUsermaster
//     const usersWithPosts1 = await citiZenUsermaster.aggregate([
//       {
//         $match: {
//           _id: { $in: combinedUserIds },
//           private: { $ne: true },
//           connected: { $ne: true },
//         }
//       },
//       {
//         $lookup: {
//           from: 'posts',
//           localField: '_id',
//           foreignField: 'user_id',
//           as: 'feed',
//         },
//       },
//       {
//         $lookup: {
//           from: 'RatingsReviews',
//           localField: '_id',
//           foreignField: 'leader_id',
//           as: 'ratings',
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstname: 1,
//           profile_img: 1,
//           profileID: 1,
//           'feed.Post': 1,
//           'feed.user_id': 1,
//           'feed.Post_discription': 1,
//           'feed._id': 1,
//           'feed.totallikesofpost': 1,
//           'feed.totalcomments': 1,
//           'feed.likedpeopledata': 1,
//           'feed.createdAt': 1,
//           'feed.post_blocked': 1,
//           ratings: {
//             $cond: { if: { $isArray: "$ratings" }, then: { $avg: "$ratings.ratings" }, else: null }
//           }
//         },
//       },
//       {
//         $sort: {
//           'feed.createdAt': -1,
//         },
//       },
//       {
//         $limit: limit
//       }
//     ]);

//     console.log("usersWithPosts1===>", usersWithPosts1);
    
    
//     // Combine the results
//     const mergedUsersWithPosts = [...usersWithPosts, ...usersWithPosts1];

//     console.log("mergedUsersWithPosts===>", mergedUsersWithPosts);
    
//     // Optionally, you can sort the combined result based on 'createdAt'
//     mergedUsersWithPosts.sort((a, b) => b.feed[0].createdAt - a.feed[0].createdAt);

//     // Pagination
//     const startIndex = offset || 0;
//     const endIndex = startIndex + limit;
//     const paginatedUsersWithPosts = mergedUsersWithPosts.slice(startIndex, endIndex);

//     console.log("final data==>", paginatedUsersWithPosts);

//     return res.status(200).json({ Status: true, message: 'Posts fetched successfully', UsersWithPosts: paginatedUsersWithPosts });

//   } catch (err) {
//     console.error(err);
//     return res.status(400).json({ Status: 'Error', Error: err.message });
//   }
// };


