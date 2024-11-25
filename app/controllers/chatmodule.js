const {CreateGroup}=require('../models/groupChatmodule')
const {v4 : uuidv4} = require('uuid')
const storeMsg=require('../models/storeMessage')
const connection=require('../models/connection')
const leaderUsermaster=require('../models/registrationleader')
const citiZenUsermaster=require('../models/registrationcitizen')
const {chatModule}=require('../models/oneTooneChat')
const onlineoffline=require('../models/onlineoffline')
const {isRoom}=require("../models/chatroom")
const mongoose=require('mongoose')

exports.createGroupRoom=async(req,res)=>{
    try{
        if(req.body.user_id!='' && req.body.joining_group!='' )
        {
            const userid=req.body.user_id
            const joining_group=req.body.joining_group
            const objectIds = joining_group.map(id =>new  mongoose.Types.ObjectId(id));
            console.log(objectIds);
            const isexists=await leaderUsermaster.findOne({_id:userid},{_id:1,firstname:1,profile_img:1,mobilenumber:1})
const usersdata=await connection.findOne({user_id:userid,connections:{$ne:[]}})
if(usersdata){
const connectionIds =usersdata.connections.map((connectionObj) =>connectionObj._id.toString())
const allGroupsValid = joining_group.every(group => connectionIds.includes(group));
const data1=await  leaderUsermaster.find({_id:{$in:objectIds}},{_id:1,firstname:1,profile_img:1,mobilenumber:1})
const data = data1.length > 0 ? data1 : await  citiZenUsermaster.find({_id:{$in:objectIds}},{_id:1,firstname:1,profile_img:1,mobilenumber:1})
console.log(data)
if (allGroupsValid){
    if(isexists){
        const room_id=uuidv4()
        const group=new CreateGroup({
            joining_group:data,
            admin_id:isexists,
            room_id:room_id,
        });
        const respons=await group.save()
            if(respons){  
              console.log(respons.joining_group.length) 
              const data =await CreateGroup.findOneAndUpdate({_id:respons._id},{$set:{totalParticepants:respons.joining_group.length}})
              console.log(data)
              if(data){ 
                const response=await CreateGroup.findOne({_id:respons._id})
                return res.status(200).send({status:"Success",message:"Group Created Successfuly",response})
            }else{
              return res.status(401).send({status:"Failure",message:"something wrong"}) 
            }
    }
    }else{
        return res.status(401).send({status:"Failure",message:"only leaders can create a group"}) 
    }
}else{
    return res.status(401).send({status:"Failure",message:"you can add only connected members"}) 
}
    }else{
            return res.status(401).send({status:"Failure",message:"you dont have connections to create a group"}) 
        }
    }else{
      return res.status(401).send({status:"Failure",message:"Please Provide All Field"}) 
  }
  }
        catch(Error){
	    console.log('error123',Error)
            return res.status(401).send({status:"Failure",message:"Somthing Eroor",Error})
        }
}
exports.createGroupUpdateImage=async(req,res)=>{
    try{
        if(req.body.user_id!='' && req.body.joining_group!='' )
        {
            const {_id,groupName,Groupabout}=req.body
            const group_profile_img=req.file.filename
            console.log(group_profile_img)
     const response =await CreateGroup.findOneAndUpdate({_id:_id},{$set:{group_profile_img:group_profile_img,groupName:groupName,Groupabout:Groupabout}})
            if(response){
                const result = await CreateGroup.findOne({_id:_id})
                console.log(result)
                res.status(200).send({status:"Success",message:"Group Updated Successfuly",result})
    }
    }else{
            res.status(401).send({status:"Failure",message:"Please Provide All Field"}) 
        }
    }
        catch(Error){
	    console.log('error123',Error)
            res.status(401).send({status:"Failure",message:"Somthing Eroor",Error})
        }
}
exports.newJoingMemberinGroup = async (req, res) => {
        try {
          const { _id } = req.body;
          const admin_id = req.body.admin_id;
          const other_id = req.body.joining_group;
      
          const result = await CreateGroup.findOne(
            { _id: _id },
            { _id: 0, joining_group: 1, admin_id: 1 }
          );
          const result1 = result.admin_id._id.toString()
          const result2 =result.joining_group.map((item) => item._id.toString());
          console.log(result2)
          const usersdata=await connection.findOne({user_id:admin_id,connections:{$ne:[]}})
          if(usersdata){
          const connectionIds = usersdata.connections.map((connectionObj) => connectionObj._id.toString());
          const allGroupsValid = other_id.every(group => connectionIds.includes(group));
          const data1=await  leaderUsermaster.find({_id:other_id},{_id:1,firstname:1,profile_img:1,mobilenumber:1})
const data = data1.length > 0 ? data1 : await  citiZenUsermaster.find({_id:other_id},{_id:1,firstname:1,profile_img:1,mobilenumber:1})
console.log(data)
          if (allGroupsValid){
          if (result1===admin_id&&!result2.includes(other_id)) {
            const isSubset = other_id.every((value) => result2.includes(value));
            const noneAlreadyInGroup = !other_id.some((value) =>
              result2.includes(value)
            );
            if (!isSubset && noneAlreadyInGroup) {
              const respons = await CreateGroup.findOneAndUpdate(
                { _id: _id },
                { $push: { joining_group: { $each: data } } }, 
                { new: true }
              );
              console.log(respons);
             
              const responses=await CreateGroup.findOneAndUpdate({_id:_id},{$set:{totalParticepants:respons.joining_group.length}})
              if (responses) {
                const response=await CreateGroup.findOne({_id:_id})
                res.status(201).send({ status: "Success", response });
              }
            } else {
              res
                .status(401)
                .send({ status: "Failure", message: "you are already in the group" });
            }
          } else {
            res.status(401).send({ status: "Failure", message: "not an admin or u cannot add admin to groupmembers" });
          }
        }else{
            return res.status(401).send({status:"Failure",message:"you can add only connected members"}) 
        }
      }else{
        return res.status(401).send({status:"Failure",message:"you dont have connections to create a group"}) 
      }
     } catch (err) {
          console.log(err);
          res.send({ message: "something went wrong", err });
        }
};
exports.deleteGroupMember=async(req,res)=>{
    try{
        const _id=req.body._id
        const other_id=req.body.other_id
        const admin_id=req.body.admin_id
        const result=await CreateGroup.findOne({_id:_id})
        console.log(result)
        const result1=result.admin_id._id.toString()
        const result2=result.joining_group.map((item) => item._id.toString());
        console.log(result1,result2)
        const data1=await  leaderUsermaster.findOne({_id:other_id},{_id:1,firstname:1,profile_img:1,mobilenumber:1})
        const data = data1 || await  citiZenUsermaster.findOne({_id:other_id},{_id:1,firstname:1,profile_img:1,mobilenumber:1})
        console.log(data)
        if(result1===admin_id){
            if(result2.includes(other_id)){
    const respons=await CreateGroup.findOneAndUpdate({_id:_id},{$pull:{joining_group:data}},{new:true});
    if(respons){
        console.log(respons)
        const data=await CreateGroup.findOneAndUpdate({_id:_id},{$set:{totalParticepants:respons.joining_group.length}})
        if(data){
          const response=await CreateGroup.findOne({_id:_id})
          res.status(201).send({status:"Success",message:'data fetched successfully',response})
        }else{
          res.status(401).send({status:"Failure",message:"Somthing problem in doning updating group"})
        }
    }
    else{
        res.status(401).send({status:"Failure",message:"Somthing problem in doning updating group"})
    }
   }else{
    res.status(401).send({status:"Failure",message:"not in group"})
   }
}else{
    res.status(401).send({status:"Failure",message:"not an admin"})
}
 }
  catch(err){
       console.log(err)
       res.send({message:"somthing problem",err})
   }
}
exports.exitGroup=async(req,res)=>{
    try{
        const roomid=req.params._id
        const other_id=req.body.other_id
        if(roomid){
        const result= await CreateGroup.findOne({_id:roomid})
        console.log(result)
        const result1=result.joining_group.map((item) => item._id.toString());
        const result2=result.admin_id._id.toString()
        console.log(result1,result2)
        const data1=await  leaderUsermaster.findOne({_id:other_id},{_id:1,firstname:1,profile_img:1,mobilenumber:1})
        const datas = data1|| await  citiZenUsermaster.findOne({_id:other_id},{_id:1,firstname:1,profile_img:1,mobilenumber:1})
        console.log(datas)
            if(result2!=other_id){
                if(result1.includes(other_id)){
                const respons=await CreateGroup.findOneAndUpdate({_id:roomid},{$pull:{joining_group:datas}},{new:true});
                console.log(respons)
                const data=await CreateGroup.findOneAndUpdate({_id:roomid},{$set:{totalParticepants:respons.joining_group.length}})
                if(data){
                  const response=await CreateGroup.findOne({_id:roomid})
                  res.status(200).send({status:true,message:"room deleted successfully",response})
                } else{
                  res.status(401).send({message:"error while updating"})
              }
               
                }else{
                    res.status(401).send({message:"you are not in group"})
                }
            }else{
                res.status(401).send({message:"you are an admin pls make someone admin and exit"})
            }
    }else{
        res.status(401).send({message:"provide roomid"})
    }
}catch(err)
    {
        res.send({message:"somthing is wrong"})
        console.log(err)
    }
}
exports.viewGroupInfo=async(req,res)=>{
    try{
        const {_id}=req.body
        const response = await CreateGroup.findOne({_id:_id})
        if(response){
            res.send({status:true,message:"Get Data Succesfully",response})
        }
        else{
            res.status(401).send({message:"user not found"})
        }
    }catch(err)
    {
        res.send({message:"somthing is wrong"})
        console.log(err)
    }
}
exports.updateProfileGroup=async(req,res)=>{
    try{
        const {_id}=req.params
        console.log(_id)

        if(req.body.groupName&& _id){
            const response=await CreateGroup.findOneAndUpdate({_id:_id},{$set:{groupName:req.body.groupName}},{new:true})
            res.status(200).send({status:true,message:"Your profile update successfully",response})
           }
        else if(req.body.Groupabout&& _id){
            const response=await CreateGroup.findOneAndUpdate({_id:_id},{$set:{Groupabout:req.body.Groupabout}},{new:true})
            res.status(200).send({status:true,message:"Your profile update successfully",response})
        }
         else if(req.file&& _id){
        console.log(req.file.filename)
            const response=await CreateGroup.findOneAndUpdate({_id:_id},{$set:{group_profile_img:req.file.filename}},{new:true})
            res.status(200).send({status:true,message:"Your profile update successfully",response})
        }
         else{
            res.status(400).send({status:false,message:"No updated New"})
         }
     }
     catch(err){
        console.log("error",err)
        res.send({ErrorMessage:"somthing error",err})
        }
}
exports.createChat1=async(req,res)=>{
        try{
          const {sender_id,other_id}=req.body
          if(!sender_id|| !other_id){
              res.send({status:false,ErrorMessage:"Please Before Provide user_id and other_id"})
             }
          else{
            const isuser1 = await citiZenUsermaster.findOne({ _id: sender_id })
            const isuser= isuser1 || await leaderUsermaster.findOne({_id:sender_id})
    
            const isotherUser1 = await citiZenUsermaster.findOne({ _id: other_id })
            const isotherUser = isotherUser1 || await leaderUsermaster.findOne({_id: other_id})
            const isuserblocked = isuser.blockContact.includes(other_id)|| false
            const isotheruserblocked = isotherUser.blockContact.includes(sender_id)|| false
              if(isuserblocked||isotheruserblocked){
                res.send({status:false,Message: "Blocked Contact, cannot createChat" })
              }else{
            const isuserprivate=isuser.public
            const isotheruserprivate=isotherUser.public
            const data=await connection.findOne({sender_id:sender_id})
            const isuserconnected=data?.connections?.map(connection => connection._id) || []
            const data1=await connection.findOne({user_id:other_id})
            const isotherconnected=data1?.connections?.map(connection => connection._id) || []
           
            const connectuserStr = isuserconnected.map(id => id.toString());
          
            const connectotherStr = isotherconnected.map(id => id.toString());
            if (isuser.private===true || isotherUser.private===true) {
              res.send({status:false,Message: "Cannot create chat with private user" })
            }else if (connectuserStr.includes(sender_id)||connectuserStr.includes(other_id)||
            connectotherStr.includes(sender_id)||connectotherStr.includes(other_id)){
      
      if(sender_id.length>10){
               let l = sender_id.length 
               if(l===12){
                sender_id = sender_id.substring(2)
               }
               else if(l===13){
                sender_id = sender_id.substring(3)
               }
            }
            if(other_id.length>10){
                let l = other_id.length 
                if(l===12){
                    other_id = other_id.substring(2)
                }
                else if(l===13){
                    other_id = other_id.substring(3)
                }
            }
      
            var response=await chatModule.find({
                  $or:[{sender_id:sender_id,other_id:other_id},{sender_id:other_id,other_id:sender_id}]
            });
            if(response.length!=0){
         
                res.status(200).send({status:"Success",message:"room created",response})
            }
      
            else{
               const room_id=uuidv4()
               const user=new chatModule({
                sender_id:sender_id,
                other_id:other_id,
                room_id:room_id.toString()
               })
              const result=await user.save();
               if(result)
               {
        
        let response=[result]
                    res.send({status:"Success",message:"room created",response})
               }
               else{
                   res.send({ErrorMessage:"some technical issue"})
               }
            }
          }else if(isotheruserprivate===true&&isuserprivate===true) {
      
               if(sender_id.length>10){
                      let l = sender_id.length 
                      if(l===12){
                        sender_id = sender_id.substring(2)
                      }
                      else if(l===13){
                        sender_id = sender_id.substring(3)
                      }
                   }
                   if(other_id.length>10){
                       let l = other_id.length 
                       if(l===12){
                        other_id = other_id.substring(2)
                       }
                       else if(l===13){
                        other_id = other_id.substring(3)
                       }
                   }
               
                   var response=await chatModule.find({
                         $or:[{sender_id:sender_id,other_id:other_id},{sender_id:other_id,other_id:sender_id}]
                   });
                   if(response.length!=0){
                  
                       res.status(200).send({status:"Success",message:"room created",response})
                   }
           
                   else{
                      const room_id=uuidv4()
                      const user=new chatModule({
                        sender_id:sender_id,
                       other_id:other_id,
                       room_id:room_id.toString()
                      })
                     const result=await user.save();
                      if(result)
                      {
                   
                   let response=[result]
                           res.send({status:"Success",message:"room created",response})
                      }
                      else{
                          res.send({ErrorMessage:"some technical issue"})
                      }
                   }
          }else{
            return res.status(400).send({status:false,Message:"your not connected to chat with user"})
          }
              }
      }
      }catch(err){
        console.log(err)
            return res.status(400).send({ErrorMessage:"somthing error"})
        }
}
 exports.getmessage=async(req,res)=>{
    try{
        const room_id=req.params.room_id
        
            const result=await storeMsg.find({room_id:room_id});
            if(result!=0){
                res.send({status:"Success",message:"Get All Data Successfully",result});
            
        }else{
            res.send({status:false,message:"no message found"});
        }
    }catch(err){
console.log(err)
         res.sen({ErrorMessage:"somthing error"})
    }
}
exports.deleteroom=async(req,res)=>{
    try{
        const roomid=req.params._id
        const admin_id=req.body.admin_id
        if(roomid&&admin_id){
        const result= await CreateGroup.findOne({_id:roomid})
        console.log(result)
        const result1 = result.admin_id._id.toString();
        console.log(result1)
        if(result1===admin_id){
            const result= await CreateGroup.findOneAndDelete({_id:roomid})
        res.status(200).send({status:true,message:"room deleted successfully",result})

    }else{
      res.status(401).send({message:"your not having authority to delete the group"})
    }
}else if(roomid&&!admin_id){
  const result= await chatModule.findOne({_id:roomid})
  if(result){
    const result= await chatModule.findOneAndDelete({_id:roomid})
    res.status(200).send({status:true,message:"room deleted successfully",result})
  }else{
    res.status(401).send({message:"Try again later"})
  }
}
}catch(err)
{
    res.send({message:"somthing is wrong"})
    console.log(err)
}
}
exports.deleteMesage=async(req,res)=>{
    try{
    const{_id}=req.body
    if(!_id){
        return res.status(406).json({status:'Failure',message:'mobilenumber and are required field'})
    }else{
        const response=await storeMsg.deleteMany({_id:{$in:_id}})
        if(response){
            console.log(response)
            return res.status(200).send({status:'Success',message:'message deleted successfully',response})
        }else{
            return res.status(406).json({status:'Failure',message:'message couldnot be deleted'})
        }
    }
}catch(err){
    console.log(err);
    return res.status(400).json({status:'Error',message:'somthing went wrong',err})
}
}
exports.clearChat=async (req,res)=>{
    try{
    const roomid=req.params.room_id
    const response = await storeMsg.deleteMany({room_id:roomid})
        if(response){
         
            res.status(200).send({status:"Success",message:"All Chat are Clear",response})
        }
        else{
            res.send({message:"Not found Room id"})
        }
        
    }catch(err){
        console.log(err)
        res.status(401).send({status:"Failure",messaage:"somthing problem in clear chat"})
    }
}
// exports.ChatHistory = async (req, res) => {
//   var user_id = req.body.user_id;
//   try {
//     const result = await chatModule.find(
//       { user_id: { $eq: user_id } },
//       { _id: 0, room_id: 1, other_id: 1, user_id: 1 }
//     );

//     const other_id1 = result.map((doc) => doc.other_id);

//     const result5 = await chatModule.find(
//       { other_id: { $eq: user_id } },
//       { _id: 0, room_id: 1, user_id: 1 }
//     );

//     const user_id1 = result5.map((doc) => doc.user_id);

//     const roomIds3 = result5.map((doc) => doc.room_id);

//     const result1 = await CreateGroup.find(
//       {
//         $or: [
//           { joining_group: { $eq: user_id } },
//           { admin_id: { $eq: user_id } },
//         ],
//       },
//       { _id: 0, room_id: 1 }
//     );
//     const roomIds = result.map((doc) => doc.room_id);

//     const roomIds1 = result1.map((doc) => doc.room_id);

//     const result1Promise = chatModule.aggregate([
//       {
//         $match: {
//           other_id: { $in: other_id1 },
//           room_id: { $in: roomIds },
//         },
//       },
//       {
//         $lookup: {
//           from: "citizenusermasters",
//           localField: "other_id",
//           foreignField: "_id", 
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);
//     const result2Promise = chatModule.aggregate([
//       {
//         $match: {
//           user_id: { $in: user_id1 },
//           room_id: { $in: roomIds3 },
//         },
//       },
//       {
//         $lookup: {
//           from: "citizenusermasters",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);

//     const result3Promise = chatModule.aggregate([
//       {
//         $match: {
//           other_id: { $in: other_id1 },
//           room_id: { $in: roomIds },
//         },
//       },
//       {
//         $lookup: {
//           from: "leaderusermasters",
//           localField: "other_id",
//           foreignField: "_id", 
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);
//     const result4Promise = chatModule.aggregate([
//       {
//         $match: {
//           user_id: { $in: user_id1 },
//           room_id: { $in: roomIds3 },
//         },
//       },
//       {
//         $lookup: {
//           from: "leaderusermasters",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);

//     const [result8, result9,result10,result11] = await Promise.all([
//       result1Promise,
//       result2Promise,
//       result3Promise,
//       result4Promise
//     ]);

//     const combinedResult = [...result8, ...result9, ...result10, ...result11];
//     console.log(combinedResult);
//     const uniqueCombinedResult = Array.from(new Set(combinedResult.map(JSON.stringify)), JSON.parse);
  

//     const filteredResult = uniqueCombinedResult.filter(
//       (item) => item.data.length > 0
//     );
//     const result3 = await CreateGroup.aggregate([
//       {
//         $match: {
//           room_id: { $in: roomIds1 },
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);
//     const data=result3.sort((a, b) => {
//       const aRecentMessage =
//         a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage =
//         b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });
//     combinedResult.sort((a, b) => {
//       const aRecentMessage =
//         a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage =
//         b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });
//     const response = filteredResult.concat(data);
//     response.sort((a, b) => {
//       const aRecentMessage = a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage = b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });

//     if (response) {
//       res.send({ status: true, message: "Get Data Succesfully", response });
//     } else {
//       res.status(400).send({ message: "somthing is wrong", err });
//     }
//   } catch (err) {
//     res.send({ message: "somthing is wrong" });
//     console.log(err);
//   }
// };
exports.userlogin=async(req,res)=>{
  try{

const {userId,time}=req.body
const data=await onlineoffline.findOne({userId:userId})
console.log(data)
if(data){
  const update=await onlineoffline.findOneAndUpdate({userId:userId},{$set:{online:true,Offline:false,time:time}})
  if(update){
  const response=await onlineoffline.findOne({userId:userId})
  return res.status(200).send({status:true,message:'user is Online',response})
  }else{
      return res.status(200).send({status:false,message:'something error'})
  }
}else{
  const data=new onlineoffline({
      userId:userId,
      online:true,
      Offline:false,
      time:time
  })
  const response=await data.save()
  return res.status(200).send({status:true,message:'user is Online',response})
}

  }catch(err){
      
          return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                 }
}
exports.userOffline=async(req,res)=>{
  try{

const {userId,time}=req.body
const data=await onlineoffline.findOne({userId:userId})
console.log(data)
if(data){
  const update=await onlineoffline.findOneAndUpdate({userId:userId},{$set:{Offline:true,online:false,time:time}})
  if(update){
  const response=await onlineoffline.findOne({userId:userId})
  return res.status(200).send({status:true,message:'user is offlne',response})
  }else{
      return res.status(200).send({status:false,message:'something error'})
  }
}else{
  const data=new onlineoffline({
      userId:userId,
      Offline:true,
      online:false,
      time:time
  })
  const response=await data.save()
  return res.status(200).send({status:true,message:'user is Online',response})
}

  }catch(err){
      
          return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                 }
}
exports.getuseronlineorofline=async(req,res)=>{
  try{
const {userId}=req.body
const response=await onlineoffline.find({userId:userId})
return res.status(200).send({status:true,message:'get successfully',response})
  }catch(err){
          return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                 }
}
exports.isChatRoom=async(req, res)=>{
  try{
const {sender_id,room_id}=req.body
if(!sender_id&&!room_id){
  res.status(400).send({status:false,message:"Please provide all the detais"})
}else{
  const data=await isRoom.findOne({sender_id:sender_id,room_id:room_id})
  if(data){
    await isRoom.findOneAndUpdate({sender_id:sender_id,room_id:room_id},{isChatroom:true})
    const response=await isRoom.findOne({sender_id:sender_id,room_id:room_id})
    res.status(200).send({status:true,message:" is chatroom",response})
  }else{
    const datas=new isRoom({
      sender_id:sender_id,
      room_id:room_id,
      isChatroom:true
    })
    const response=await datas.save()
    res.status(400).send({status:true,message:" is chatroom",response})
  }
}
}catch (err) {
  
    return res.status(400).json({ status: "Error", message: "Something went wrong", err });
  }
}
exports.isNotChatRoom=async(req, res)=>{
  try{
const {sender_id,room_id}=req.body
if(!sender_id&&!room_id){
  res.status(400).send({status:false,message:"Please provide all the detais"})
}else{
  const data=await isRoom.findOne({sender_id:sender_id,room_id:room_id})
  
  if(data){
    await isRoom.findOneAndUpdate({sender_id:sender_id,room_id:room_id},{isChatroom:false})
    const response=await isRoom.findOne({sender_id:sender_id,room_id:room_id})
    res.status(200).send({status:true,message:" is chatroom",response})
  }else{
    const datas=new isRoom({
      sender_id:sender_id,
      room_id:room_id,
      isChatroom:false
    })
    const response=await datas.save()
    res.status(400).send({status:true,message:" is chatroom",response})
  }
}
}catch (err) {
  
    return res.status(400).json({ status: "Error", message: "Something went wrong", err });
  }
}
exports.getAllGroups=async(req,res)=>{
  try{
    const {user_id}=req.body
    if(!user_id){
      return res.status(400).json({ status: "Error", message: "please provide user_id"});
    }else{
      const result=await CreateGroup.find({})
      if(result){
        return res.status(200).json({ status:true, message: "Group Data Fetched Successfully",result});
      }
    }
    }catch (err) {
      console.log(err)
        return res.status(400).json({ status: "Error", message: "Something went wrong", err });
      }
}

// exports.ChatHistory = async (req, res) => {
//   var user_id = req.body.user_id;
//   try {
//     const result = await chatModule.find(
//       { other_id: { $eq: user_id } },
//       { _id: 0, room_id: 1, other_id: 1, sender_id: 1 }
//     );

//     const other_id1 = result.map((doc) => doc.other_id);

//     const result5 = await chatModule.find(
//       { sender_id: { $eq: user_id } },
//       { _id: 0, room_id: 1, sender_id: 1 }
//     );

//     const user_id1 = result5.map((doc) => doc.sender_id);

//     const roomIds3 = result5.map((doc) => doc.room_id);

//     const result1 = await CreateGroup.find(
//       {
//         $or: [
//           { joining_group: { $eq: user_id } },
//           { admin_id: { $eq: user_id } },
//         ],
//       },
//       { _id: 0, room_id: 1 }
//     );
//     const roomIds = result.map((doc) => doc.room_id);

//     const roomIds1 = result1.map((doc) => doc.room_id);

//     const result1Promise = chatModule.aggregate([
//       {
//         $match: {
//           other_id: { $in: other_id1 },
//           room_id: { $in: roomIds },
//         },
//       },
//       {
//         $lookup: {
//           from: "citizenusermasters",
//           localField: "other_id",
//           foreignField: "_id", 
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);
//     const result2Promise = chatModule.aggregate([
//       {
//         $match: {
//           sender_id: { $in: user_id1 },
//           room_id: { $in: roomIds3 },
//         },
//       },
//       {
//         $lookup: {
//           from: "citizenusermasters",
//           localField: "sender_id",
//           foreignField: "_id",
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);

//     const result3Promise = chatModule.aggregate([
//       {
//         $match: {
//           other_id: { $in: other_id1 },
//           room_id: { $in: roomIds },
//         },
//       },
//       {
//         $lookup: {
//           from: "leaderusermasters",
//           localField: "other_id",
//           foreignField: "_id", 
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);
//     const result4Promise = chatModule.aggregate([
//       {
//         $match: {
//           sender_id: { $in: user_id1 },
//           room_id: { $in: roomIds3 },
//         },
//       },
//       {
//         $lookup: {
//           from: "leaderusermasters",
//           localField: "sender_id",
//           foreignField: "_id",
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);

//     const [result8, result9,result10,result11] = await Promise.all([
//       result1Promise,
//       result2Promise,
//       result3Promise,
//       result4Promise
//     ]);

//     const combinedResult = [...result8, ...result9, ...result10, ...result11];
//     console.log(combinedResult);
//     const uniqueCombinedResult = Array.from(new Set(combinedResult.map(JSON.stringify)), JSON.parse);
  

//     const filteredResult = uniqueCombinedResult.filter(
//       (item) => item.data.length > 0
//     );
//     const result3 = await CreateGroup.aggregate([
//       {
//         $match: {
//           room_id: { $in: roomIds1 },
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);
//     const data=result3.sort((a, b) => {
//       const aRecentMessage =
//         a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage =
//         b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });
//     combinedResult.sort((a, b) => {
//       const aRecentMessage =
//         a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage =
//         b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });
//     const response = filteredResult.concat(data);
//     response.sort((a, b) => {
//       const aRecentMessage = a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage = b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });

//     if (response) {
//       res.send({ status: true, message: "Get Data Succesfully", response });
//     } else {
//       res.status(400).send({ message: "somthing is wrong", err });
//     }
//   } catch (err) {
//     res.send({ message: "somthing is wrong" });
//     console.log(err);
//   }
// };


// exports.ChatHistory = async (req, res) => {
//   var user_id = req.body.user_id;
//   try {
//     const result = await chatModule.find(
//       { other_id: { $eq: user_id } },
//       { _id: 0, room_id: 1, other_id: 1, sender_id: 1 }
//     );

//     const other_id1 = result.map((doc) => doc.other_id);

//     const result5 = await chatModule.find(
//       { sender_id: { $eq: user_id } },
//       { _id: 0, room_id: 1, sender_id: 1 }
//     );

//     const user_id1 = result5.map((doc) => doc.sender_id);

//     const roomIds3 = result5.map((doc) => doc.room_id);

//     const result1 = await CreateGroup.find(
//       {
//         $or: [
//           { joining_group: { $eq: user_id } },
//           { admin_id: { $eq: user_id } },
//         ],
//       },
//       { _id: 0, room_id: 1 }
//     );
//     const roomIds = result.map((doc) => doc.room_id);

//     const roomIds1 = result1.map((doc) => doc.room_id);

//     const result1Promise = chatModule.aggregate([
//       {
//         $match: {
//           other_id: { $in: other_id1 },
//           room_id: { $in: roomIds },
//         },
//       },
//       {
//         $lookup: {
//           from: "citizenusermasters",
//           localField: "other_id",
//           foreignField: "_id", 
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);
//     const result2Promise = chatModule.aggregate([
//       {
//         $match: {
//           sender_id: { $in: user_id1 },
//           room_id: { $in: roomIds3 },
//         },
//       },
//       {
//         $lookup: {
//           from: "citizenusermasters",
//           localField: "sender_id",
//           foreignField: "_id",
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);

//     const result3Promise = chatModule.aggregate([
//       {
//         $match: {
//           other_id: { $in: other_id1 },
//           room_id: { $in: roomIds },
//         },
//       },
//       {
//         $lookup: {
//           from: "leaderusermasters",
//           localField: "other_id",
//           foreignField: "_id", 
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);
//     const result4Promise = chatModule.aggregate([
//       {
//         $match: {
//           sender_id: { $in: user_id1 },
//           room_id: { $in: roomIds3 },
//         },
//       },
//       {
//         $lookup: {
//           from: "leaderusermasters",
//           localField: "sender_id",
//           foreignField: "_id",
//           as: "otherdata",
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);

//     const [result8, result9,result10,result11] = await Promise.all([
//       result1Promise,
//       result2Promise,
//       result3Promise,
//       result4Promise
//     ]);

//     const combinedResult = [...result8, ...result9, ...result10, ...result11];
//     console.log(combinedResult);
//     const uniqueCombinedResult = Array.from(new Set(combinedResult.map(JSON.stringify)), JSON.parse);
  

//     const filteredResult = uniqueCombinedResult.filter(
//       (item) => item.data.length > 0
//     );
//     const result3 = await CreateGroup.aggregate([
//       {
//         $match: {
//           room_id: { $in: roomIds1 },
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);
//     const data=result3.sort((a, b) => {
//       const aRecentMessage =
//         a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage =
//         b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });
//     combinedResult.sort((a, b) => {
//       const aRecentMessage =
//         a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage =
//         b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });
//     const response = filteredResult.concat(data);
//     response.sort((a, b) => {
//       const aRecentMessage = a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage = b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });

//     if (response) {
//       res.send({ status: true, message: "Get Data Succesfully", response });
//     } else {
//       res.status(400).send({ message: "somthing is wrong", err });
//     }
//   } catch (err) {
//     res.send({ message: "somthing is wrong" });
//     console.log(err);
//   }
// };


// exports.ChatHistory = async (req, res) => {
//   var user_id = req.body.user_id;
//   try {
   
//     const chatRooms = await chatModule.find({
//       $or: [
//         { other_id: user_id },
//         { sender_id: user_id },
//       ],
//     }, { _id: 0, room_id: 1 });

//     const roomIds = chatRooms.map((doc) => doc.room_id);


//     // Find all chat messages in the individual chat rooms
//     const chatMessagesPromise = chatModule.aggregate([
//       {
//         $match: {
//           room_id: { $in: roomIds },
//         },
//       },
//       {
//         $lookup: {
//           from: "citizenusermasters", // Replace with the appropriate collection name
//           localField: "other_id",
//           foreignField: "_id",
//           as: "otherdata",
//         },
//       },


//       {
//         $lookup: {
//           from: "leaderusermasters", // Replace with the appropriate collection name for leaders
//           localField: "other_id",
//           foreignField: "_id",
//           as: "otherdata",
//         },
//       },

//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },


//     ]);


//     const chatMessages = await chatMessagesPromise;

//     // Sort the messages by recent message createdAt timestamp
//     chatMessages.sort((a, b) => {
//       const aRecentMessage =
//         a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage =
//         b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });

//     if (chatMessages) {
//       res.send({ status: true, message: "Get Data Successfully", response: chatMessages });
//     } else {
//       res.status(400).send({ message: "Something went wrong" });
//     }
//   } catch (err) {
//     res.send({ message: "Something went wrong" });
//     console.log(err);
//   }
// };


// exports.ChatHistory = async (req, res) => {
//   var user_id = req.body.user_id;
//   try {
//     // Find all chat rooms where the user is either the sender or the other user
//     const chatRooms = await chatModule.find({
//       $or: [
//         { other_id: user_id },
//         { sender_id: user_id },
//       ],
//     }, { _id: 0, room_id: 1 });

//     const roomIds = chatRooms.map((doc) => doc.room_id);

//     // Find all chat messages in the individual chat rooms
//     const chatMessagesPromise = chatModule.aggregate([
//       {
//         $match: {
//           room_id: { $in: roomIds },
//         },
//       },
//       {
//         $lookup: {
//           from: "storemsgs",
//           localField: "room_id",
//           foreignField: "room_id",
//           as: "data",
//         },
//       },
//     ]);

//     const chatMessages = await chatMessagesPromise;

//     // Sort the messages by recent message createdAt timestamp
//     chatMessages.sort((a, b) => {
//       const aRecentMessage =
//         a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
//       const bRecentMessage =
//         b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
//       return bRecentMessage - aRecentMessage;
//     });

//     if (chatMessages) {
//       res.send({ status: true, message: "Get Data Successfully", response: chatMessages });
//     } else {
//       res.status(400).send({ message: "Something went wrong" });
//     }
//   } catch (err) {
//     res.send({ message: "Something went wrong" });
//     console.log(err);
//   }
// };

function removeDuplicatesByRoomId(arr) {
  const unique = new Map();
  arr.forEach((item) => {
    const roomId = item.room_id;
    if (!unique.has(roomId) || unique.get(roomId).createdAt < item.createdAt) {
      unique.set(roomId, item);
    }
  });
  return [...unique.values()];
}
exports.createChat=async(req,res)=>{
  try{
    const {sender_id,other_id}=req.body
    if(!sender_id|| !other_id){
        res.send({status:false,ErrorMessage:"Please Before Provide user_id and other_id"})
       }
    else{
      const isuser1 = await citiZenUsermaster.findOne({ _id: sender_id },{_id:1,firstname:1,profile_img:1,public:1,private:1,blockContact:1,connected:1})
      const isuser= isuser1 || await leaderUsermaster.findOne({_id:sender_id},{_id:1,firstname:1,profile_img:1,public:1,private:1,blockContact:1,connected:1})

      const isotherUser1 = await citiZenUsermaster.findOne({ _id: other_id },{_id:1,firstname:1,profile_img:1,public:1,private:1,blockContact:1,connected:1})
      const isotherUser = isotherUser1 || await leaderUsermaster.findOne({_id: other_id},{_id:1,firstname:1,profile_img:1,public:1,private:1,blockContact:1,connected:1})
      const isuserblocked = isuser.blockContact.includes(other_id)|| false
      const isotheruserblocked = isotherUser.blockContact.includes(sender_id)|| false
        if(isuserblocked||isotheruserblocked){
          res.send({status:false,Message: "Blocked Contact, cannot createChat" })
        }else{
          
      const isuserprivate=isuser.public
      const isotheruserprivate=isotherUser.public
      const data=await connection.findOne({sender_id:sender_id})
      const isuserconnected=data?.connections?.map(connection => connection._id) || []
      const data1=await connection.findOne({user_id:other_id})
      const isotherconnected=data1?.connections?.map(connection => connection._id) || []
     
      const connectuserStr = isuserconnected.map(id => id.toString());
    
      const connectotherStr = isotherconnected.map(id => id.toString());
      if (isuser.private===true || isotherUser.private===true) {
        res.send({status:false,Message: "Cannot create chat with private user" })
      }else if (connectuserStr.includes(sender_id)||connectuserStr.includes(other_id)||
      connectotherStr.includes(sender_id)||connectotherStr.includes(other_id)){

if(sender_id.length>10){
         let l = sender_id.length 
         if(l===12){
          sender_id = sender_id.substring(2)
         }
         else if(l===13){
          sender_id = sender_id.substring(3)
         }
      }
      if(other_id.length>10){
          let l = other_id.length 
          if(l===12){
              other_id = other_id.substring(2)
          }
          else if(l===13){
              other_id = other_id.substring(3)
          }
      }

      var response=await chatModule.find({
            $or:[{sender_id:sender_id,other_id:other_id},{sender_id:other_id,other_id:sender_id}]
      });
      if(response.length!=0){
   
          res.status(200).send({status:"Success",message:"room created",response})
      }

      else{
         const room_id=uuidv4()
         const user=new chatModule({
          sender_id:sender_id,
          other_id:other_id,
          room_id:room_id.toString(),
          sender_idData:isuser,
          other_idData:isotherUser
         })
        const result=await user.save();
         if(result)
         {
  
  let response=[result]
              res.send({status:"Success",message:"room created",response})
         }
         else{
             res.send({ErrorMessage:"some technical issue"})
         }
      }
    }else if(isotheruserprivate===true&&isuserprivate===true) {

         if(sender_id.length>10){
                let l = sender_id.length 
                if(l===12){
                  sender_id = sender_id.substring(2)
                }
                else if(l===13){
                  sender_id = sender_id.substring(3)
                }
             }
             if(other_id.length>10){
                 let l = other_id.length 
                 if(l===12){
                  other_id = other_id.substring(2)
                 }
                 else if(l===13){
                  other_id = other_id.substring(3)
                 }
             }
         
             var response=await chatModule.find({
                   $or:[{sender_id:sender_id,other_id:other_id},{sender_id:other_id,other_id:sender_id}]
             });
             if(response.length!=0){
            
                 res.status(200).send({status:"Success",message:"room created",response})
             }
     
             else{
                const room_id=uuidv4()
                const user=new chatModule({
                  sender_id:sender_id,
                 other_id:other_id,
                 room_id:room_id.toString(),
                 sender_idData:isuser,
          other_idData:isotherUser
                })
               const result=await user.save();
                if(result)
                {
             
             let response=[result]
                     res.send({status:"Success",message:"room created",response})
                }
                else{
                    res.send({ErrorMessage:"some technical issue"})
                }
             }
    }else{
      return res.status(400).send({status:false,Message:"your not connected to chat with user"})
    }
        }
}
}catch(err){
  console.log(err)
      return res.status(400).send({ErrorMessage:"somthing error"})
  }
}

exports.ChatHistory = async (req, res) => {
  var user_id = req.body.user_id;
  try {
    const result = await chatModule.find(
      { other_id: { $eq: user_id } },
      { _id: 0, room_id: 1, other_id: 1, sender_id: 1 }
    );
  

    const other_id1 = result.map((doc) => doc.other_id);

    const result5 = await chatModule.find(
      { sender_id: { $eq: user_id } },
      { _id: 0, room_id: 1, sender_id: 1,other_id: 1 }
    );
    
    const user_id1 = result5.map((doc) => doc.sender_id);
    console.log(user_id1);
    const roomIds3 = result5.map((doc) => doc.room_id);

    const ids=new  mongoose.Types.ObjectId(user_id)
    const result1 = await CreateGroup.find(
      {
        $or: [
          { "joining_group._id": ids },
          { 'admin_id._id': ids },
        ],
      },
      { _id: 0, room_id: 1 }
    );
    console.log(result1)
    const roomIds = result.map((doc) => doc.room_id);

    const roomIds1 = result1.map((doc) => doc.room_id);

    const result1Promise = chatModule.aggregate([
      {
        $match: {
          other_id: { $in: other_id1 },
          room_id: { $in: roomIds },
        },
      },
      {
        $lookup: {
          from: "storemsgs",
          localField: "room_id",
          foreignField: "room_id",
          as: "data",
        },
      },
    ]);
    const result2Promise = chatModule.aggregate([
      {
        $match: {
          sender_id: { $in: user_id1 },
          room_id: { $in: roomIds3 },
        },
      },
      {
        $lookup: {
          from: "storemsgs",
          localField: "room_id",
          foreignField: "room_id",
          as: "data",
        },
      },
    ]);
    const [result8, result9] = await Promise.all([
      result1Promise,
      result2Promise,
    ]);

    const combinedResult = [...result8, ...result9];
    const uniqueCombinedResult = Array.from(new Set(combinedResult.map(JSON.stringify)), JSON.parse);
  

    const filteredResult = uniqueCombinedResult.filter(
      (item) => item.data.length > 0
    );
    const result3 = await CreateGroup.aggregate([
      {
        $match: {
          room_id: { $in: roomIds1 },
        },
      },
      {
        $lookup: {
          from: "storemsgs",
          localField: "room_id",
          foreignField: "room_id",
          as: "data",
        },
      },
    ]);
    const data=result3.sort((a, b) => {
      const aRecentMessage =
        a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
      const bRecentMessage =
        b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
      return bRecentMessage - aRecentMessage;
    });
    combinedResult.sort((a, b) => {
      const aRecentMessage =
        a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
      const bRecentMessage =
        b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
      return bRecentMessage - aRecentMessage;
    });
   
    const uniqueResponse = filteredResult.concat(data);
    const response = removeDuplicatesByRoomId(uniqueResponse);
    response.sort((a, b) => {
      const aRecentMessage = a.data.length > 0 ? a.data[a.data.length - 1].createdAt : 0;
      const bRecentMessage = b.data.length > 0 ? b.data[b.data.length - 1].createdAt : 0;
      return bRecentMessage - aRecentMessage;
    });

    if (response) {
      res.send({ status: true, message: "Get Data Succesfully", response });
    } else {
      res.status(400).send({ message: "somthing is wrong", err });
    }
  } catch (err) {
    res.send({ message: "somthing is wrong" });
    console.log(err);
  }
};  



