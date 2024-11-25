const weshareSchema=require('../models/weshare')
const leaderUsermaster=require('../models/registrationleader')
const citiZenUsermaster=require('../models/registrationcitizen')
exports.createShare=async(req,res)=>{
try{
const {user_id,description}=req.body
if(!user_id&&!description){
    return res.status(400).json({ Status: false, message: "please provide details" });
}else{
  const userdetails=await leaderUsermaster.findOne({_id:user_id},{_id:1,profile_img:1,firstname:1,profileID:1}) ||
  await citiZenUsermaster.findOne({_id:user_id},{_id:1,profile_img:1,firstname:1,profileID:1}) 
    const data=new weshareSchema({
        user_id:user_id,
        description:description,
        userdeatils:userdetails
    })
    const response=await data.save()
    if(response){
            return res.status(200).json({ Status: true, message: "weshare created successful", response });
          }else{
            return res.status(400).json({ Status: false, message: "error while creating sos" });
          }
}
}catch (err) {
    console.log('find error', err);
    return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
  }
}
exports.getMyShares=async(req,res)=>{
try{
    const {user_id}=req.body
    if(!user_id){
        return res.status(400).json({ Status: false, message: "please provide Id" });
    }else{
        const response=await weshareSchema.find({user_id:user_id})
        if(response){
            return res.status(200).json({ Status: true, message: "weshare fetched successful", response });
          }else{
            return res.status(400).json({ Status: false, message: "error while fetching sos" });
          }
    }
}catch (err) {
    console.log('find error', err);
    return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
  }
}
exports.getAllShare=async(req,res)=>{
    try{
            const response=await weshareSchema.find()
            if(response){
                return res.status(200).json({ Status: true, message: "weshare fetched successful", response });
              }else{
                return res.status(400).json({ Status: false, message: "error while fetching sos" });
        }
    }catch (err) {
        console.log('find error', err);
        return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
      }
}

exports.deleteShare=async(req,res)=>{
    try{
        const {user_id,weshare_id}=req.body
        if(!user_id){
            return res.status(400).json({ Status: false, message: "please provide Id" });
        }else{
            const response=await weshareSchema.findOneAndDelete({user_id:user_id,_id:weshare_id})
            if(response){
                return res.status(200).json({ Status: true, message: "weshare deleted successful", response });
              }else{
                return res.status(400).json({ Status: false, message: "error while deleting sos" });
              }
        }
    }catch (err) {
        console.log('find error', err);
        return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
      }
}