const leaderUsermaster=require('../models/registrationleader')
const citiZenUsermaster=require('../models/registrationcitizen')
const locations=require('../models/loaction')
const sosSchema=require('../models/sos');
const CommentSos = require('../models/commentSos')
const RatingsReviews = require('../models/ratingsReviews')
const replycommentSos = require('../models/replycommentSos')
const mongoose = require('mongoose');

// exports.locationUpdate = async (req, res) => {
//     try {
//       const { _ids, latitude, longitude } = req.body;
  
//       const partner1 = await leaderUsermaster.find(
//         { _id: { $in: _ids } },
//         { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1,token:1 }
//       );
// const partner2=await citiZenUsermaster.find( { _id: { $in: _ids } },
//     { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1 })
//     const partners = partner1 //[...partner1, ...partner2];
// console.log(partners)
//       const partner_ids = partners.map(doc => doc._id);
//       const checkPartners = await locations.find({ 'user_id._id': { $in: partner_ids } });
  
//       if (checkPartners.length > 0) {
//         const results = await locations.updateMany(
//           { 'user_id._id': { $in: partner_ids } },
//           {
//             $set: { location: { latitude: latitude, longitude: longitude } }
//           }
//         );
  
//         console.log(results);
//         const result=await locations.find({'user_id._id': { $in: partner_ids }})
//         return res.status(200).json({ Status: true, message: "Location update successful", result });
//       } else {
//         const newPartnerLocationsData = partners.map(partner => ({
//             user_id: partner,
//             location: {
//               latitude: latitude,
//               longitude: longitude,
//             },
//           }));
  
//         const result = await locations.insertMany(newPartnerLocationsData);
//         console.log(result);
//         return res.status(200).json({ Status: true, message: "Location update successful", result });
//       }
//     } catch (err) {
//       console.log('Registration error', err);
//       return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
//     }
// };



// exports.locationUpdate = async (req, res) => {
//   try {
//     const { _ids, latitude, longitude } = req.body;

//     const partner1 = await leaderUsermaster.find(
//       { _id: { $in: _ids } },
//       { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1, token: 1 }
//     );

//     const partner2 = await citiZenUsermaster.find(
//       { _id: { $in: _ids } },
//       { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1 }
//     );

//     const partners = partner1; // Assuming you want to use data from leaderUsermaster
//     const partner_ids = partners.map(doc => doc._id);
//     const checkPartners = await locations.find({ 'user_id._id': { $in: partner_ids } });

//     if (checkPartners.length > 0) {
//       const results = await locations.updateMany(
//         { 'user_id._id': { $in: partner_ids } },
//         {
//           $set: {
//             'location.latitude': latitude,
//             'location.longitude': longitude,
//             'user_id': partners, // Set the entire user_id field
//           },
//         }
//       );

//       console.log(results);

//       const result = await locations.find({ 'user_id._id': { $in: partner_ids } });
//       return res.status(200).json({ Status: true, message: "Location update successful", result });
//     } else {
//       const newPartnerLocationsData = partners.map(partner => ({
//         user_id: partner,
//         location: {
//           latitude: latitude,
//           longitude: longitude,
//         },
//       }));

//       const result = await locations.insertMany(newPartnerLocationsData);
//       console.log(result);
//       return res.status(200).json({ Status: true, message: "Location update successful", result });
//     }
//   } catch (err) {
//     console.log('Registration error', err);
//     return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
//   }
// };
exports.locationUpdate = async (req, res) => {
  try {
    const { _ids, latitude, longitude } = req.body;

    const partner1 = await leaderUsermaster.find(
      { _id: { $in: _ids } },
      { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1, token: 1 }
    );

    const partner2 = await citiZenUsermaster.find(
      { _id: { $in: _ids } },
      { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1 }
    );

    const partners = partner1; // Assuming you want to use data from leaderUsermaster

    const checkPartners = await locations.find({ 'user_id._id': { $in: _ids } });

    if (checkPartners.length > 0) {
      const results = await Promise.all(
        _ids.map(async (id) => {
          const existingPartner = partners.find(p => p._id.toString() === id.toString());
          if (existingPartner) {
            const result = await locations.updateOne(
              { 'user_id._id': id },
              {
                $set: {
                  'location.latitude': latitude,
                  'location.longitude': longitude,
                  'user_id': existingPartner,
                },
              }
            );
            return result;
          }
          return null;
        })
      );

      console.log(results);

      const result = await locations.find({ 'user_id._id': { $in: _ids } });
      return res.status(200).json({ Status: true, message: "Location update successful", result });
    } else {
      const newPartnerLocationsData = partners.map(partner => ({
        user_id: partner,
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      }));

      const result = await locations.insertMany(newPartnerLocationsData);
      console.log(result);
      return res.status(200).json({ Status: true, message: "Location update successful", result });
    }
  } catch (err) {
    console.log('Registration error', err);
    return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
  }
};

exports.getSosData = async(req,res)=>{
  try{
const {sosId}=req.body 
if(!sosId){
  return res.status(400).json({ Status: false, message: "please provide Id" });
}else{
  const result=await sosSchema.findOne({sosId:sosId})
if(result){
  return res.status(200).json({ Status: true, message: "sos deatils successful", result });
}else{
  return res.status(400).json({ Status: false, message: "CouldNot find any sos" });
}
}
}catch (err) {
      console.log('Registration error', err);
      return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
    }
}
exports.ongoingSos=async(req,res)=>{
try{
    const {_id}=req.body 
    if(!_id){
      return res.status(400).json({ Status: false, message: "please provide Id" });
    }else{
      const partner1 = await leaderUsermaster.findOne(
        { _id:_id},
        { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1,token:1 }
      );
      if(partner1){
      const result=await sosSchema.find({ leaders:partner1,closed:false})
      if(result){
        return res.status(200).json({ Status: true, message: "ongoing deatils fetched successful", result });
      }else{
        return res.status(400).json({ Status: false, message: "CouldNot find any sos" });
      }
    } else{
      const id=new mongoose.Types.ObjectId(_id)
      const result=await sosSchema.find({ "user_id._id":id,closed:false}) 
      if(result){
        return res.status(200).json({ Status: true, message: "ongoing deatils fetched successful", result });
      }else{
        return res.status(400).json({ Status: false, message: "CouldNot find any sos" });
      }
    }
  }
}catch (err) {
      console.log('find error', err);
      return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
    }
}
exports.completedSos=async(req,res)=>{
  try{
    const {_id}=req.body 
    if(!_id){
      return res.status(400).json({ Status: false, message: "please provide Id" });
    }else{
      const partner1 = await leaderUsermaster.findOne(
        { _id:_id},
        { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1,token:1 }
      );
      if(partner1){
      const result=await sosSchema.find({ "accptedleader":partner1,closed:true})
      if(result){
        return res.status(200).json({ Status: true, message: "completed deatils fetched successful", result });
      }else{
        return res.status(400).json({ Status: false, message: "CouldNot find any sos" });
      }
    } else{
      const id=new mongoose.Types.ObjectId(_id)
      const result=await sosSchema.find({ "user_id._id":id,closed:true}) 
      if(result){
        return res.status(200).json({ Status: true, message: "completed deatils fetched successful", result });
      }else{
        return res.status(400).json({ Status: false, message: "CouldNot find any sos" });
      }
    }
  }
}catch (err) {
      console.log('find error', err);
      return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
    }
}
// exports.commentsSos = async (req, res) => {
//   try {
//       const { user_id, sosId, commentSos } = req.body;

//       if (!user_id || !sosId || !commentSos) {
//           return res.status(400).json({ Status: false, message: "Please provide proper details" });
//       }
//       const  leader= await leaderUsermaster.findOne({ _id: user_id })
//      const citizen= await citiZenUsermaster.findOne({ _id: user_id });
//       if(leader){
//         const data = await sosSchema.findOne({sosId: sosId });
// const isLeaderAccepted = data.accptedleader.some(acceptedLeader => acceptedLeader._id == user_id);
//       if (isLeaderAccepted) {
//           const comment = new CommentSos({
//               user_id,
//               commentSos,
//               sosId
//           });
//           const savedComment = await comment.save();
//           return res.status(200).json({ Status: true, message: "SOS Comment added successfully", data: savedComment });
//       } else {
//           return res.status(403).json({ Status: false, message: 'Only accepted leaders can submit comments.' });
//       }
//       }else{
//         const comment = new CommentSos({
//           user_id,
//           commentSos,
//           sosId
//       });
//       const savedComment = await comment.save();
//       return res.status(200).json({ Status: true, message: "SOS Comment added successfully", data: savedComment });
//       }

//   } catch (err) {
//       console.error('Error:', err);
//       return res.status(500).json({ Status: false, message: err.message || 'Something went wrong' });
//   }
// };
// exports.replyCommentsSos = async (req, res) => {
//   try {
//       const { user_id, sosId, commentSos,comment_id } = req.body;

//       if (!user_id || !sosId || !commentSos ||!comment_id) {
//           return res.status(400).json({ Status: false, message: "Please provide proper details" });
//       }
//       const leader = await leaderUsermaster.findOne({ _id: user_id })
//       const citizen =await citiZenUsermaster.findOne({ _id: user_id })
//       if(leader){      
// const data = await sosSchema.findOne({sosId: sosId });
// const isLeaderAccepted = data.accptedleader.some(acceptedLeader => acceptedLeader._id == user_id);
//       if (isLeaderAccepted) {
//           const comment = new replycommentSos({
//               user_id,
//               commentSos,
//               sosId,
//               comment_id
//           });
//           const savedComment = await comment.save();
//           return res.status(200).json({ Status: true, message: "SOS Comment added successfully", data: savedComment });
//       } else {
//           return res.status(403).json({ Status: false, message: 'Only accepted leaders can submit comments.' });
//       }
//     }else{
//       const comment = new CommentSos({
//         user_id,
//         commentSos,
//         sosId
//     });
//     const savedComment = await comment.save();
//     return res.status(200).json({ Status: true, message: "SOS Comment added successfully", data: savedComment });
//     }

//   } catch (err) {
//       console.error('Error:', err);
//       return res.status(500).json({ Status: false, message: err.message || 'Something went wrong' });
//   }
// };

// exports.getSosComments = async (req, res) => {
//   try {
//     const { sosId } = req.body;
//     if (!sosId) {
//       return res.status(400).json({ Status: false, message: 'Please provide all the details' });
//     } else {
//       console.log(sosId)
//       const commentaa = await CommentSos.find({ sosId: sosId })
//       console.log(commentaa)
// const allComments = await CommentSos.aggregate([
//       {
//           $match: { sosId: sosId },
//       },
//       {
//           $lookup: {
//               from: 'replycommentSos',
//               localField: '_id',
//               foreignField: 'comment_id',
//               as: 'replies',
//           },
//       },
//       {
//           $lookup: {
//               from: 'leaderusermasters',
//               localField: 'user_id',
//               foreignField: '_id',
//               as: 'leaderUserDetails', // Populate leader user details
//           },
//       },
//       {
//           $lookup: {
//               from: 'citizenusermasters',
//               localField: 'user_id',
//               foreignField: '_id',
//               as: 'citizenUserDetails', // Populate citizen user details
//           },
//       },
//       {
//           //$unwind: "$replies" // Unwind the replies array
//           $unwind:{ path: "$replies", preserveNullAndEmptyArrays: true } // Unwind the replies array
//       },
//       {
//           $lookup: {
//               from: 'leaderusermasters',
//               localField: 'replies.user_id',
//               foreignField: '_id',
//               as: 'replies.leaderUserDetails', // Populate leader user details for replies
//           },
//       },
//       {
//           $lookup: {
//               from: 'citizenusermasters',
//               localField: 'replies.user_id',
//               foreignField: '_id',
//               as: 'replies.citizenUserDetails', // Populate citizen user details for replies
//           },
//       },
//       {
//           $group: {
//               _id: "$_id",
//               user_id: { $first: "$user_id" },
//               sosId: { $first: "$sosId" },
//               commentSos: { $first: "$commentSos" },
//               ratingsCount: { $first: "$ratingsCount" },
//               ratings: { $first: "$ratings" },
//               reviews: { $first: "$reviews" },
//               createdAt: { $first: "$createdAt" },
//               updatedAt: { $first: "$updatedAt" },
//               leaderUserDetails: { $first: "$leaderUserDetails" }, // Preserve leader user details for comments
//               citizenUserDetails: { $first: "$citizenUserDetails" }, // Preserve citizen user details for comments
//               replies: { $push: "$replies" } // Group back the replies array
//           }
//       },
//       {
//         $project: {
//             _id: 1,
//             user_id: 1,
//             sosId: 1,
//             commentSos: 1,
//             ratingsCount: 1,
//             ratings: 1,
//             reviews: 1,
//             createdAt: 1,
//             updatedAt: 1,
//             "leaderUserDetails._id": 1,
//             "leaderUserDetails.firstname": 1,
//             "leaderUserDetails.profile_img": 1,
//             "citizenUserDetails._id": 1,
//             "citizenUserDetails.firstname": 1,
//             "citizenUserDetails.profile_img": 1,
//             replies: {
//               $map: {
//                   input: { $ifNull: ["$replies", [null]] },
//                   as: "reply",
//                   in: {
//                       _id: "$$reply._id",
//                       user_id: "$$reply.user_id",
//                       sosId: "$$reply.sosId",
//                       commentSos: "$$reply.commentSos",
//                       ratingsCount: "$$reply.ratingsCount",
//                       ratings: "$$reply.ratings",
//                       reviews: "$$reply.reviews",
//                       comment_id: "$$reply.comment_id",
//                       createdAt: "$$reply.createdAt",
//                       updatedAt: "$$reply.updatedAt",
//                       leaderUserDetails: {
//                           $cond: {
//                               if: { $isArray: "$$reply.leaderUserDetails" },
//                               then: {
//                                   $map: {
//                                       input: "$$reply.leaderUserDetails",
//                                       as: "leader",
//                                       in: {
//                                         _id: "$$leader._id",
//                                           firstname: "$$leader.firstname",
//                                           profile_img: "$$leader.profile_img"
//                                       }
//                                   }
//                               },
//                               else: []
//                           }
//                       },
//                       citizenUserDetails: {
//                           $cond: {
//                               if: { $isArray: "$$reply.citizenUserDetails" },
//                               then: {
//                                   $map: {
//                                       input: "$$reply.citizenUserDetails",
//                                       as: "citizen",
//                                       in: {
//                                           _id: "$$citizen._id",
//                                           firstname: "$$citizen.firstname",
//                                           profile_img: "$$citizen.profile_img"
//                                       }
//                                   }
//                               },
//                               else: []
//                           }
//                       }
//                   }
//               }
//           }
//       }
//   }
// ]);
  
    

//       if (allComments.length > 0) {
//         const totalComments = allComments.length;

//         return res.status(200).json({ Status: true, message: 'All the Comments of Post', totalComments, response: allComments });
//       } else {
//         return res.status(400).json({ Status: false, message: 'Could not find Any Comment For The Post' });
//       }
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ Status: 'Error', Error: err });
//   }
// };


exports.addratingandreview = async (req, res) => {
  try {
    const data = req.body; // Assuming req.body is an array of objects

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(202).json({ Status: false, message: 'sumbited successfully' });
    }
    const insertDocuments = [];

    for (const item of data) {
      const { leader_id, citizen_id, sosId, trustWorthy, knowledgeable, helpful, available, courageous, efficient, reviews } = item;

      const isCitizen = await citiZenUsermaster.findOne({ _id: citizen_id });

      if (!isCitizen) {
        return res.status(403).json({ Status: false, message: 'Only citizens can provide ratings and reviews.' });
      }
     
      insertDocuments.push({
        leader_id,
        citizen_id,
        sosId,
        trustWorthy: trustWorthy || 0,
        knowledgeable: knowledgeable || 0,
        helpful: helpful || 0,
        available: available || 0,
        courageous: courageous || 0,
        efficient: efficient || 0,
        reviews: reviews || '', 
      });
    }

    const savedRatingsReviews = await RatingsReviews.insertMany(insertDocuments);

    return res.status(200).json({ Status: true, message: "Ratings and reviews added successfully", data: savedRatingsReviews });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ Status: false, message: err.message || 'Something went wrong' });
  }
};


exports.getratingsReview = async (req, res) => {
  try {
    const { leader_id } = req.body;

    if (!leader_id) {
      return res.status(400).json({ Status: false, message: "Please provide leader_id in the request body" });
    } else {
     // const result = await RatingsReviews.find({ leader_id: leader_id });
     const _id=new mongoose.Types.ObjectId(leader_id)
      const result = await RatingsReviews.aggregate([
        {
            $match: { leader_id: _id },
        },
        {
            $lookup: {
                from: 'leaderusermasters',
                localField: 'leader_id',
                foreignField: '_id',
                as: 'userDeatils',
            },
        },
        {
          $project: {
              _id: 1,
              citizen_id: 1,
              sosId: 1,
              sosId: 1,
              trustWorthy: 1,
              knowledgeable: 1,
              helpful: 1,
              available: 1,
              courageous: 1,
              efficient:1,
              reviews:1,
              "userDeatils._id": 1,
              "userDeatils.firstname": 1,
              "userDeatils.profile_img": 1,
          }
        }
  ]);
      if (result && result.length > 0) {
        return res.status(200).json({ Status: true, message: "leader_id retrieved successfully", result });
      } else {
        return res.status(404).json({ Status: false, message: "Could not find any review and ratings" });
      }
    }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ Status: false, message: err.message || 'Something went wrong' });
  }
};
 
exports.getAllratingsReview = async (req, res) => {
  try {
      const result = await RatingsReviews.aggregate([
        {
            $lookup: {
                from: 'leaderusermasters',
                localField: 'leader_id',
                foreignField: '_id',
                as: 'leaderuserDeatils',
            },
        },
        {
          $lookup: {
              from: 'citizenusermasters',
              localField: 'citizen_id',
              foreignField: '_id',
              as: 'citizenuserDeatils',
          },
      },
        {
          $project: {
              _id: 1,
              citizen_id: 1,
              sosId: 1,
              sosId: 1,
              trustWorthy: 1,
              knowledgeable: 1,
              helpful: 1,
              available: 1,
              courageous: 1,
              efficient:1,
              reviews:1,
              "leaderuserDeatils._id": 1,
              "leaderuserDeatils.firstname": 1,
              "leaderuserDeatils.profile_img": 1,
              "citizenuserDeatils._id":1,
              "citizenuserDeatils.firstname":1,
              "citizenuserDeatils.profile_img":1
          }
        }
  ]);
      if (result && result.length > 0) {
        return res.status(200).json({ Status: true, message: "retrieved successfully", result });
      } else {
        return res.status(404).json({ Status: false, message: "Could not find any review and ratings" });
      }
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ Status: false, message: err.message || 'Something went wrong' });
  }
};


exports.getSosComments = async (req, res) => {
  try {
    const { sosId } = req.body;
    if (!sosId) {
      return res.status(400).json({ Status: false, message: 'Please provide all the details' });
    } else {
      console.log(sosId);
      const commentaa = await CommentSos.find({ sosId: sosId });
      console.log(commentaa);

      const allComments = await CommentSos.aggregate([
        {
          $match: { sosId: sosId },
        },
        {
          $lookup: {
            from: 'replycommentSos',
            localField: '_id',
            foreignField: 'comment_id',
            as: 'replies',
          },
        },
        {
          $lookup: {
            from: 'leaderusermasters',
            localField: 'user_id',
            foreignField: '_id',
            as: 'leaderUserDetails', // Populate leader user details
          },
        },
        {
          $lookup: {
            from: 'citizenusermasters',
            localField: 'user_id',
            foreignField: '_id',
            as: 'citizenUserDetails', // Populate citizen user details
          },
        },
        {
          $unwind: { path: "$replies", preserveNullAndEmptyArrays: true }, // Unwind the replies array
        },
        {
          $lookup: {
            from: 'leaderusermasters',
            localField: 'replies.user_id',
            foreignField: '_id',
            as: 'replies.leaderUserDetails', // Populate leader user details for replies
          },
        },
        {
          $lookup: {
            from: 'citizenusermasters',
            localField: 'replies.user_id',
            foreignField: '_id',
            as: 'replies.citizenUserDetails', // Populate citizen user details for replies
          },
        },
        {
          $group: {
            _id: "$_id",
            user_id: { $first: "$user_id" },
            sosId: { $first: "$sosId" },
            commentSos: { $first: "$commentSos" },
            ratingsCount: { $first: "$ratingsCount" },
            ratings: { $first: "$ratings" },
            reviews: { $first: "$reviews" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
            leaderUserDetails: { $first: "$leaderUserDetails" }, // Preserve leader user details for comments
            citizenUserDetails: { $first: "$citizenUserDetails" }, // Preserve citizen user details for comments
            replies: { $push: "$replies" } // Group back the replies array
          }
        },
        {
          $sort: { createdAt: -1 } // Sort comments by createdAt in descending order
        },
        {
          $project: {
            _id: 1,
            user_id: 1,
            sosId: 1,
            commentSos: 1,
            ratingsCount: 1,
            ratings: 1,
            reviews: 1,
            createdAt: 1,
            updatedAt: 1,
            "leaderUserDetails._id": 1,
            "leaderUserDetails.firstname": 1,
            "leaderUserDetails.profile_img": 1,
            "citizenUserDetails._id": 1,
            "citizenUserDetails.firstname": 1,
            "citizenUserDetails.profile_img": 1,
            replies: {
              $map: {
                input: { $ifNull: ["$replies", [null]] },
                as: "reply",
                in: {
                  _id: "$$reply._id",
                  user_id: "$$reply.user_id",
                  sosId: "$$reply.sosId",
                  commentSos: "$$reply.commentSos",
                  ratingsCount: "$$reply.ratingsCount",
                  ratings: "$$reply.ratings",
                  reviews: "$$reply.reviews",
                  comment_id: "$$reply.comment_id",
                  createdAt: "$$reply.createdAt",
                  updatedAt: "$$reply.updatedAt",
                  leaderUserDetails: {
                    $cond: {
                      if: { $isArray: "$$reply.leaderUserDetails" },
                      then: {
                        $map: {
                          input: "$$reply.leaderUserDetails",
                          as: "leader",
                          in: {
                            _id: "$$leader._id",
                            firstname: "$$leader.firstname",
                            profile_img: "$$leader.profile_img"
                          }
                        }
                      },
                      else: []
                    }
                  },
                  citizenUserDetails: {
                    $cond: {
                      if: { $isArray: "$$reply.citizenUserDetails" },
                      then: {
                        $map: {
                          input: "$$reply.citizenUserDetails",
                          as: "citizen",
                          in: {
                            _id: "$$citizen._id",
                            firstname: "$$citizen.firstname",
                            profile_img: "$$citizen.profile_img"
                          }
                        }
                      },
                      else: []
                    }
                  }
                }
              }
            }
          }
        }
      ]);

      if (allComments.length > 0) {
        const totalComments = allComments.length;

        return res.status(200).json({ Status: true, message: 'All the Comments of Post', totalComments, response: allComments });
      } else {
        return res.status(400).json({ Status: false, message: 'Could not find Any Comment For The Post' });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Status: 'Error', Error: err });
  }
};

exports.commentsSos = async (req, res) => {
  try {
      const { user_id, sosId, commentSos } = req.body;

      if (!user_id || !sosId || !commentSos) {
          return res.status(400).json({ Status: false, message: "Please provide proper details" });
      }
      const leader = await leaderUsermaster.findOne({ _id: user_id });
      const citizen = await citiZenUsermaster.findOne({ _id: user_id });
      if (leader) {
          const data = await sosSchema.findOne({ sosId: sosId });
          const isLeaderAccepted = data.accptedleader.some(acceptedLeader => acceptedLeader._id == user_id);
          if (isLeaderAccepted) {
              const comment = new CommentSos({
                  user_id,
                  commentSos,
                  sosId
              });
              const savedComment = await comment.save();
              return res.status(200).json({ Status: true, message: "SOS Comment added successfully", data: savedComment });
          } else {
              return res.status(403).json({ Status: false, message: 'Only accepted leaders can submit comments.' });
          }
      } else {
          const comment = new CommentSos({
              user_id,
              commentSos,
              sosId
          });
          const savedComment = await comment.save();
          return res.status(200).json({ Status: true, message: "SOS Comment added successfully", data: savedComment });
      }

  } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ Status: false, message: err.message || 'Something went wrong' });
  }
};

exports.replyCommentsSos = async (req, res) => {
  try {
      const { user_id, sosId, commentSos, comment_id } = req.body;

      if (!user_id || !sosId || !commentSos || !comment_id) {
          return res.status(400).json({ Status: false, message: "Please provide proper details" });
      }
      const leader = await leaderUsermaster.findOne({ _id: user_id });
      const citizen = await citiZenUsermaster.findOne({ _id: user_id });
      if (leader) {
          const data = await sosSchema.findOne({ sosId: sosId });
          const isLeaderAccepted = data.accptedleader.some(acceptedLeader => acceptedLeader._id == user_id);
          if (isLeaderAccepted) {
              const comment = new replycommentSos({
                  user_id,
                  commentSos,
                  sosId,
                  comment_id
              });
              const savedComment = await comment.save();
              return res.status(200).json({ Status: true, message: "SOS Comment added successfully", data: savedComment });
          } else {
              return res.status(403).json({ Status: false, message: 'Only accepted leaders can submit comments.' });
          }
      } else {
          const comment = new replycommentSos({
              user_id,
              commentSos,
              sosId,
              comment_id
          });
          const savedComment = await comment.save();
          return res.status(200).json({ Status: true, message: "SOS Comment added successfully", data: savedComment });
      }

  } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ Status: false, message: err.message || 'Something went wrong' });
  }
};

