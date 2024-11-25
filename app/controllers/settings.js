const leaderUsermaster=require('../models/registrationleader')
const citiZenUsermaster=require('../models/registrationcitizen')
const jwtTokenService = require('../services/jwt-service')
const connections=require('../models/connection')
const request=require('../models/requests')
const notification=require('../models/notification')
const mongoose=require('mongoose')
const locations=require('../models/locationcitizen')
const location=require('../models/loaction')
const RatingsReviews = require('../models/ratingsReviews')
exports.securitySetting=async(req,res)=>{
    try{
        const {_id,private,public,connected}=req.body
        if(!_id){
            return res.status(406).json({status:'Failure',message:'user_id and are required field'})
        }else{
if(_id&&private){
  const check1=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{private:private,public:false,connected:false}})
  const check2=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{private:private,public:false,connected:false}})
  if(check1){
    const response=await citiZenUsermaster.findOne({_id:_id})
    return res.status(200).json({status:true,message:'Your Account is now private',response})
  }else if(check2){
    const response=await leaderUsermaster.findOne({_id:_id})
    return res.status(200).json({status:true,message:'Your Account is now private',response})
  }
}else if(_id&&connected){
    const check1=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{connected:connected,public:false,private:false}})
    const check2=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{connected:connected,public:false,private:false}})
    if(check1){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now connected',response})
    }else if(check2){
      const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now connected',response})
    }
}else{
   const check1= await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{public:public,private:false,connected:false}})
   const check2=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{public:public,private:false,connected:false}})
    if(check1){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now public',response})
    }else if(check2){
      const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now public',response})
    }
}
}

}catch(err){
        console.log(err)
            return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                   }
}
exports.profileDataSetting=async(req,res)=>{
  try{
      const {_id,private,public,connected,feild}=req.body
      if(!_id){
          return res.status(406).json({status:'Failure',message:'user_id and are required field'})
      }else{
if(_id&&feild==='dob'){
if(_id&&feild&&private){
const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'dobsettings.private':private,'dobsettings.public':false,'dobsettings.connected':false}})
const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'dobsettings.private':private,'dobsettings.public':false,'dobsettings.connected':false}})
if(check1){
const response=await leaderUsermaster.findOne({_id:_id})
  return res.status(200).json({status:true,message:'Your Account is now private',response})
}else if(check2){
  const response=await citiZenUsermaster.findOne({_id:_id})
  return res.status(200).json({status:true,message:'Your Account is now private',response})
}
}else if(_id&&feild&&connected){
  const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'dobsettings.connected':connected,'dobsettings.public':false,'dobsettings.private':false}})
  const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'dobsettings.connected':connected,'dobsettings.public':false,'dobsettings.private':false}})
  if(check1){
      const response=await leaderUsermaster.findOne({_id:_id})
        return res.status(200).json({status:true,message:'Your Account is now connected people',response})
      }else if(check2){
        const response=await citiZenUsermaster.findOne({_id:_id})
        return res.status(200).json({status:true,message:'Your Account is now connected people',response})
      }
}else{
  const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'dobsettings.public':public,'dobsettings.private':false,'dobsettings.connected':false}})
  const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'dobsettings.public':public,'dobsettings.private':false,'dobsettings.connected':false}})
  if(check1){
      const response=await leaderUsermaster.findOne({_id:_id})
        return res.status(200).json({status:true,message:'Your Account is now public',response})
      }else if(check2){
        const response=await citiZenUsermaster.findOne({_id:_id})
        return res.status(200).json({status:true,message:'Your Account is now public',response})
      }
}
}else if(_id&&feild==='location'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'locationsionsettings.private':private,'locationsionsettings.public':false,'locationsionsettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'locationsionsettings.private':private,'locationsionsettings.public':false,'location.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'locationsionsettings.connected':connected,'locationsionsettings.public':false,'locationsionsettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'locationsionsettings.connected':connected,'locationsionsettings.public':false,'locationsionsettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'locationsionsettings.public':public,'locationsionsettings.private':false,'locationsionsettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'locationsionsettings.public':public,'locationsionsettings.private':false,'locationsionsettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    }
}else if(_id&&feild==='otherintrests'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.othersettings.private':private,'areaofintrest.othersettings.public':false,'areaofintrest.othersettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.othersettings.private':private,'areaofintrest.othersettings.public':false,'areaofintrest.othersettings.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.othersettings.connected':connected,'areaofintrest.othersettings.public':false,'areaofintrest.othersettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.othersettings.connected':connected,'areaofintrest.othersettings.public':false,'areaofintrest.othersettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.othersettings.public':public,'areaofintrest.othersettings.private':false,'areaofintrest.othersettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.othersettings.public':public,'areaofintrest.othersettings.private':false,'areaofintrest.othersettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    }
}else if(_id&&feild==='sports'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.sportssettings.private':private,'areaofintrest.sportssettings.public':false,'areaofintrest.sportssettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.sportssettings.private':private,'areaofintrest.sportssettings.public':false,'areaofintrest.sportssettings.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.sportssettings.connected':connected,'areaofintrest.sportssettings.public':false,'areaofintrest.sportssettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.sportssettings.connected':connected,'areaofintrest.sportssettings.public':false,'areaofintrest.sportssettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.sportssettings.public':public,'areaofintrest.sportssettings.private':false,'areaofintrest.sportssettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.sportssettings.public':public,'areaofintrest.sportssettings.private':false,'areaofintrest.sportssettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    } 
}else if(_id&&feild==='dance'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.dancesettings.private':private,'areaofintrest.dancesettings.public':false,'dancesettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.dancesettings.private':private,'areaofintrest.dancesettings.public':false,'dancesettings.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.dancesettings.connected':connected,'areaofintrest.dancesettings.public':false,'areaofintrest.dancesettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.dancesettings.connected':connected,'areaofintrest.dancesettings.public':false,'areaofintrest.dancesettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.dancesettings.public':public,'areaofintrest.dancesettings.private':false,'areaofintrest.dancesettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.dancesettings.public':public,'areaofintrest.dancesettings.private':false,'areaofintrest.dancesettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    }
}else if(_id&&feild==='books'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.bookssettings.private':private,'areaofintrest.bookssettings.public':false,'areaofintrest.bookssettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.bookssettings.private':private,'areaofintrest.bookssettings.public':false,'areaofintrest.bookssettings.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.bookssettings.connected':connected,'areaofintrest.bookssettings.public':false,'areaofintrest.bookssettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.bookssettings.connected':connected,'areaofintrest.bookssettings.public':false,'areaofintrest.bookssettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.bookssettings.public':public,'areaofintrest.bookssettings.private':false,'areaofintrest.bookssettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.bookssettings.public':public,'areaofintrest.bookssettings.private':false,'areaofintrest.bookssettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    }
}else if(_id&&feild==='music'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.musicsettings.private':private,'areaofintrest.musicsettings.public':false,'areaofintrest.musicsettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.musicsettings.private':private,'areaofintrest.musicsettings.public':false,'areaofintrest.musicsettings.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.musicsettings.connected':connected,'areaofintrest.musicsettings.public':false,'areaofintrest.musicsettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.musicsettings.connected':connected,'areaofintrest.musicsettings.public':false,'areaofintrest.musicsettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.musicsettings.public':public,'areaofintrest.musicsettings.private':false,'areaofintrest.musicsettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.musicsettings.public':public,'areaofintrest.musicsettings.private':false,'areaofintrest.musicsettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    }
}else if(_id&&feild==='movies'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.moviessettings.private':private,'areaofintrest.moviessettings.public':false,'areaofintrest.moviessettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.moviessettings.private':private,'areaofintrest.moviessettings.public':false,'areaofintrest.moviessettings.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.moviessettings.connected':connected,'areaofintrest.moviessettings.public':false,'areaofintrestmoviessettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.moviessettings.connected':connected,'areaofintrest.moviessettings.public':false,'areaofintrest.moviessettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.moviessettings.public':public,'moviessettings.private':false,'moviessettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'areaofintrest.moviessettings.public':public,'areaofintrest.moviessettings.private':false,'areaofintrest.moviessettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    }
}else if(_id&&feild==='languages'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'languagessionsettings.private':private,'languagessionsettings.public':false,'languagessionsettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'languagessionsettings.private':private,'languagessionsettings.public':false,'languagessionsettings.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'languagessionsettings.connected':connected,'languagessionsettings.public':false,'languagessionsettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'languagessionsettings.connected':connected,'languagessionsettings.public':false,'languagessionsettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'languagessionsettings.public':public,'languagessionsettings.private':false,'languagessionsettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'languagessionsettings.public':public,'languagessionsettings.private':false,'languagessionsettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    }
}else if(_id&&feild==='familymembers'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'familymemberssionsettings.private':private,'familymemberssionsettings.public':false,'familymemberssionsettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'familymemberssionsettings.private':private,'familymemberssionsettings.public':false,'familymemberssionsettings.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'familymemberssionsettings.connected':connected,'familymemberssionsettings.public':false,'familymemberssionsettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'familymemberssionsettings.connected':connected,'familymemberssionsettings.public':false,'familymemberssionsettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'familymemberssionsettings.public':public,'familymemberssionsettings.private':false,'familymemberssionsettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'familymemberssionsettings.public':public,'familymemberssionsettings.private':false,'familymemberssionsettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    }
}else if(_id&&feild==='proffession'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'proffessionsettings.private':private,'proffessionsettings.public':false,'proffessionsettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'proffessionsettings.private':private,'proffessionsettings.public':false,'proffessionsettings.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'proffessionsettings.connected':connected,'proffessionsettings.public':false,'proffessionsettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'proffessionsettings.connected':connected,'proffessionsettings.public':false,'proffessionsettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'proffessionsettings.public':public,'proffessionsettings.private':false,'proffessionsettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'proffessionsettings.public':public,'proffessionsettings.private':false,'proffessionsettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    }
}else if(_id&&feild==='education'){
  if(_id&&feild&&private){
    const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'educationsettings.private':private,'educationsettings.public':false,'educationsettings.connected':false}})
    const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'educationsettings.private':private,'educationsettings.public':false,'educationsettings.connected':false}})
    if(check1){
    const response=await leaderUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }else if(check2){
      const response=await citiZenUsermaster.findOne({_id:_id})
      return res.status(200).json({status:true,message:'Your Account is now private',response})
    }
    }else if(_id&&feild&&connected){
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'educationsettings.connected':connected,'educationsettings.public':false,'educationsettings.private':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'educationsettings.connected':connected,'educationsettings.public':false,'educationsettings.private':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now connected people',response})
          }
    }else{
      const check1=await leaderUsermaster.findOneAndUpdate({_id:_id},{$set:{'educationsettings.public':public,'educationsettings.private':false,'educationsettings.connected':false}})
      const check2=await citiZenUsermaster.findOneAndUpdate({_id:_id},{$set:{'educationsettings.public':public,'educationsettings.private':false,'educationsettings.connected':false}})
      if(check1){
          const response=await leaderUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }else if(check2){
            const response=await citiZenUsermaster.findOne({_id:_id})
            return res.status(200).json({status:true,message:'Your Account is now public',response})
          }
    }
}
}
}catch(err){
      console.log(err)
          return res.status(400).send({Status:'Error',message:'somthing went wrong'})
                 }
}
exports.blockContact = async(req,res)=>{
  try{
      const {user_id,other_number} = req.body
      const lresult1=await leaderUsermaster.findOne({_id:user_id},{_id:0,blockContact:1})
      console.log(lresult1)
      const lresult2=lresult1 ?lresult1.blockContact ||  [] : []
      const cresult1=await citiZenUsermaster.findOne({_id:user_id},{_id:0,blockContact:1})
      console.log(cresult1)
      const cresult2=cresult1?cresult1.blockContact ||  [] : []
      if(!user_id || !other_number){
          return res.status(406).json({status:'Failure',message:'user_id and other_number are required field'})
      }else if(lresult1&&!lresult2.includes(other_number)) {
const other_numbers=new mongoose.Types.ObjectId(other_number)
console.log(other_numbers)
          const response = await leaderUsermaster.findOneAndUpdate({_id:user_id},{$push:{blockContact:other_numbers}})
          const data=await leaderUsermaster.findOne({_id:other_number},{_id:1,profile_img:1,firstname:1,token:1})
          await connections.updateOne({user_id:user_id},{$pull:{connections:data}})
          await connections.updateOne({user_id:user_id},{$pull:{totalrequest:data}})
          await notification.findOneAndDelete({})
          const filter = {
              $or: [
                  {
                    fromUser: other_number,
                    toUser: user_id
                  },
                  {
                    fromUser: user_id,
                    toUser: other_number
                  }
                ]
            };
            await request.findOneAndDelete(filter);
          if(response){
              const respons=await leaderUsermaster.findOne({_id:user_id})
          return res.status(200).send({status:'Success',message:'blocked successfully',respons})
          }
       
      }
      else if(cresult1&&!cresult2.includes(other_number)){
        const other_numbers=new mongoose.Types.ObjectId(other_number)
          const response = await citiZenUsermaster.findOneAndUpdate({_id:user_id},{$push:{blockContact:other_numbers}})
          const data=await citiZenUsermaster.findOne({_id:other_number},{_id:1,profile_img:1,firstname:1,token:1})
          await connections.updateOne({user_id:user_id},{$pull:{connections:data}})
          await connections.updateOne({user_id:user_id},{$pull:{totalrequest:data}})
          await notification.findOneAndDelete({})
          const filter = {
              $or: [
                  {
                    fromUser: other_number,
                    toUser: user_id
                  },
                  {
                    fromUser: user_id,
                    toUser: other_number
                  }
                ]
            };
            await request.findOneAndDelete(filter);
          if(response){
              const respons=await citiZenUsermaster.findOne({_id:user_id})
          return res.status(200).send({status:'Success',message:'blocked successfully',respons})
          }
    }
  else{
          return res.status(406).json({status:'Failure',message:'already in blocked contact'})
      }

  }catch(err){
      console.log(err)
      return res.status(400).json({status:'Error',message:'somthing went wrong',err})
  }
}
exports.unBlockContact=async(req,res)=>{
  try{
      const {user_id,other_number} = req.body
      const lresult1=await leaderUsermaster.findOne({_id:user_id},{_id:0,blockContact:1})
      const lresult2=lresult1?lresult1.blockContact || []:[]
      const cresult1=await citiZenUsermaster.findOne({_id:user_id},{_id:0,blockContact:1})
      const cresult2=cresult1?cresult1.blockContact || []:[]

      if(!user_id || !other_number){
          return res.status(406).json({status:'Failure',message:'user_id and other_number are required field'})
      }else if(lresult1&&lresult2.includes(other_number)) {
          const other_numbers= new mongoose.Types.ObjectId(other_number)
          const respons = await leaderUsermaster.findOneAndUpdate({_id:user_id},{$pull:{blockContact:other_numbers}})
          if(respons){
              const response=await leaderUsermaster.findOne({_id:user_id})
          return res.status(200).send({status:'Success',message:'unblocked successfully',response})
          }
       
      }
      else if (cresult1&&cresult2.includes(other_number)){
        {
          const other_numbers=new mongoose.Types.ObjectId(other_number)
          const respons = await citiZenUsermaster.findOneAndUpdate({_id:user_id},{$pull:{blockContact:other_numbers}})
          if(respons){
              const response=await citiZenUsermaster.findOne({_id:user_id})
          return res.status(200).send({status:'Success',message:'unblocked successfully',response})
          }
       
      }
      }
      else{
          return res.status(406).json({status:'Failure',message:'block the contact to unblock'})
      }

  }catch(err){
     console.log(err)
      return res.status(400).json({status:'Error',message:'somthing went wrong',err})
  }
}
exports.getBlockContact = async (req, res) => {
try {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(406).json({ status: 'Failure', message: 'user_id is a required field' });
  } else {
    const userl = await leaderUsermaster.findOne({ _id:new  mongoose.Types.ObjectId(user_id)}, { _id: 0, blockContact: 1 });
    const userc = await citiZenUsermaster.findOne({ _id:new mongoose.Types.ObjectId(user_id)}, { _id: 0, blockContact: 1 });
    if(userl){
    if (!userl) {
      return res.status(404).json({ status: 'Failure', message: 'User not found or deactivated' });
    }else{
            const ids = userl.blockContact;
            const result = await leaderUsermaster.find({ _id: { $in: ids } }, { _id: 1, name: 1, profile_img: 1 })
    
      const response = await leaderUsermaster.findOne({ _id: new mongoose.Types.ObjectId(user_id)}, { _id: 0, blockContact: 1 });
      return res.status(200).send({ status: 'Success', message: 'Data fetched blockcontact',response,result });
    } 
  }else if(userc){
    const ids = userc.blockContact;
    console.log(ids)
    const result1 = await citiZenUsermaster.findOne({ _id: { $in: ids } }, { _id: 1, firstname: 1, profile_img: 1 })
const result2 = await leaderUsermaster.findOne({ _id: { $in: ids } }, { _id: 1, firstname: 1, profile_img: 1 })
let result;
 result2 ? result = result2 : result = result1
const response = await citiZenUsermaster.findOne({ _id:   new mongoose.Types.ObjectId(user_id)}, { _id: 0, blockContact: 1 });

return res.status(200).send({ status: 'Success', message: 'Data fetched blockcontact',response,result });
  }
}
} catch (err) {
  console.log(err)
  return res.status(500).json({ status: 'Error', message: 'Internal server error', err });
}
};
// exports.locationUpdatecitizen = async (req, res) => {
//   try {
//     const { _ids, latitude, longitude } = req.body;

//     const partner1 = await leaderUsermaster.find(
//       { _id: { $in: _ids } },
//       { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1,token:1 }
//     );
// const partner2=await citiZenUsermaster.find( { _id: { $in: _ids } },
//   { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1 })
//   const partners = partner2 //[...partner1, ...partner2];
// console.log(partners)
//     const partner_ids = partners.map(doc => doc._id);
//     const checkPartners = await locations.find({ 'user_id._id': { $in: partner_ids } });

//     if (checkPartners.length > 0) {
//       const results = await locations.updateMany(
//         { 'user_id._id': { $in: partner_ids } },
//         {
//           $set: { location: { latitude: latitude, longitude: longitude } }
//         }
//       );

//       console.log(results);
//       const result=await locations.find({'user_id._id': { $in: partner_ids }})
//       return res.status(200).json({ Status: true, message: "Location update successful", result });
//     } else {
//       const newPartnerLocationsData = partners.map(partner => ({
//           user_id: partner,
//           location: {
//             latitude: latitude,
//             longitude: longitude,
//           },
//         }));

//       const result = await locations.insertMany(newPartnerLocationsData);
//       console.log(result);
//       return res.status(200).json({ Status: true, message: "Location update successful", result });
//     }
//   } catch (err) {
//     console.log('Registration error', err);
//     return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
//   }
// };

exports.locationUpdatecitizen = async (req, res) => {
  try {
    const { _ids, latitude, longitude } = req.body;

    const partner2 = await citiZenUsermaster.find(
      { _id: { $in: _ids } },
      { firstname: 1, mobilenumber: 1, _id: 1, profile_img: 1 }
    );

    const partners = partner2;

    const partner_ids = partners.map(doc => doc._id);
    const checkPartners = await locations.find({ 'user_id._id': { $in: partner_ids } });

    if (checkPartners.length > 0) {
      const results = await Promise.all(
        partner_ids.map(async (partnerId, index) => {
          const result = await locations.updateOne(
            { 'user_id._id': partnerId },
            {
              $set: {
                'location.latitude': latitude,
                'location.longitude': longitude,
                'user_id': partners[index], // Set the entire user_id field
              },
            }
          );
          console.log(`Update result for partner with ID: ${partnerId}`, result);
          return result;
        })
      );

      // Fetch updated data after the update
      const updatedResult = await locations.find({ 'user_id._id': { $in: partner_ids } });
      console.log('Updated result:', updatedResult);
      console.log('Update results:', results);

      return res.status(200).json({ Status: true, message: "Location update successful", result: updatedResult });
    } else {
      const newPartnerLocationsData = partners.map(partner => ({
        user_id: partner,
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      }));

      const result = await locations.insertMany(newPartnerLocationsData);
      console.log('Insert result:', result);

      // Fetch the inserted data
      const insertedData = await locations.find({ 'user_id._id': { $in: partner_ids } });
      console.log('Inserted data:', insertedData);

      return res.status(200).json({ Status: true, message: "Location update successful", result: insertedData });
    }
  } catch (err) {
    console.log('Registration error', err);
    return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
  }
};

// exports.nearbycitizens=async(req,res)=>{
//   try{
//     const {latitude,longitude}=req.body
//     const senderLocation = {
//       latitude: parseFloat(latitude), 
//       longitude: parseFloat(longitude), 
//     };
    
// const citizenlocation = await locations.find({
//       "location.latitude": {
//         $gte: senderLocation.latitude - 0.045,
//         $lte: senderLocation.latitude + 0.045,
//       },
//       "location.longitude": {
//         $gte: senderLocation.longitude - 0.045,
//         $lte: senderLocation.longitude + 0.045,
//       },
//       user_id: { $ne: "" } 
//     }).sort({ _id: -1 });
//     return res.status(200).json({status: true,message: "Location Data Fetched Successfully",citizenlocation});
//   }catch(err){
//     console.log('Registration error', err);
//     return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
//   }
// }





 


// exports.nearbyleaders = async (req, res) => {
//   try {
//     const { latitude, longitude, updatedIds } = req.body;
//     const senderLocation = {
//       latitude: parseFloat(latitude),
//       longitude: parseFloat(longitude),
//     };
//     const userId = req.user ? req.user._id : null;

//     const leaderlocation = await location.find({
//       "location.latitude": {
//         $gte: senderLocation.latitude - 0.045,
//         $lte: senderLocation.latitude + 0.045,
//       },
//       "location.longitude": {
//         $gte: senderLocation.longitude - 0.045,
//         $lte: senderLocation.longitude + 0.045,
//       },
//       user_id: { $ne: userId },
//     }).sort({ _id: -1 }).lean();

//     const filtered = leaderlocation.filter((item) => {
//       const itemIdString = item.user_id && item.user_id._id ? item.user_id._id.toString() : null;
//       const updatedIdsString = updatedIds ? updatedIds.toString() : null;
//       return itemIdString !== updatedIdsString;
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Location Data Fetched Successfully",
//       leaderlocation: filtered
//     });
//   } catch (err) {
//     console.log('Error:', err);
//     return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
//   }
// };

exports.nearbyleaders = async (req, res) => {
  try {
    const { latitude, longitude, updatedIds, viewer_id } = req.body;
    const senderLocation = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };
    const userId = req.user ? req.user._id : null;

    const distanceInKm = 50; // Desired distance in kilometers
    const range = distanceInKm / 111.12; // Approximately 1 degree of latitude is about 111.12 kilometers

    let leaderlocation = await location
      .find({
        "location.latitude": {
          $gte: senderLocation.latitude - range,
          $lte: senderLocation.latitude + range,
        },
        "location.longitude": {
          $gte: senderLocation.longitude - range,
          $lte: senderLocation.longitude + range,
        },
        user_id: { $ne: userId },
      })
      .sort({ _id: -1 })
      .lean();

    if (leaderlocation.length === 0) {
      // Expand the range if no leaders found within the 50 km range
      leaderlocation = await location
        .find({
          "location.latitude": {
            $gte: senderLocation.latitude - (range * 2),
            $lte: senderLocation.latitude + (range * 2),
          },
          "location.longitude": {
            $gte: senderLocation.longitude - (range * 2),
            $lte: senderLocation.longitude + (range * 2),
          },
          user_id: { $ne: userId },
        })
        .sort({ _id: -1 })
        .lean();
    }

    // Use a Set to keep track of unique user IDs
    const uniqueUserIds = new Set();

    // Filter the leaderlocation array based on unique user IDs
    const filtered = leaderlocation.filter((item) => {
      const userIdString = item.user_id._id.toString();
      if (!uniqueUserIds.has(userIdString) && userIdString !== updatedIds) {
        uniqueUserIds.add(userIdString);
        return true;
      }
      return false;
    });
console.log(filtered)
const leaderIds = filtered.map(item => item.user_id._id);
const ratingsPromises = leaderIds.map(leaderId =>
  RatingsReviews.find({ leader_id: leaderId }, { _id: 0, leader_id: 1, trustWorthy: 1,knowledgeable:1,helpful:1,
  available:1,courageous:1,efficient:1 })
);
const ratingsResults = await Promise.all(ratingsPromises);

// Calculate average ratings for each leader

const leadersWithRatings = filtered.map((leader, index) => {
  const trustWorthrate = ratingsResults[index].map(trustWorth => trustWorth.trustWorthy);
  console.log(trustWorthrate)
  const trustWorthrateavg = trustWorthrate.reduce((total, trustWorthy) => total + trustWorthy, 0) / trustWorthrate.length;
  const knowledgeablerate = ratingsResults[index].map(knowledgeabl => knowledgeabl.knowledgeable);
  const knowledgeablerateavg = knowledgeablerate.reduce((total, knowledgeable) => total + knowledgeable, 0) / knowledgeablerate.length;

  const helpulrate = ratingsResults[index].map(helpu => helpu.helpful);
  const helpulrateavg = helpulrate.reduce((total, helpful) => total + helpful, 0) / helpulrate.length;

  const availablerate = ratingsResults[index].map(availabl => availabl.available);
  const availableavg = availablerate.reduce((total, available) => total + available, 0) / availablerate.length;

  const courageousrate = ratingsResults[index].map(courageou => courageou.courageous);
  const courageousavg = courageousrate.reduce((total, courageous) => total + courageous, 0) / courageousrate.length;

  const couefficient = ratingsResults[index].map(efficien => efficien.efficient);
  const efficientavg = couefficient.reduce((total, efficient) => total + efficient, 0) / couefficient.length;
  let totalSum = 0;
  let totalCount = 0;
  ratingsResults.forEach(rating => {
    totalSum += trustWorthrateavg + knowledgeablerateavg + helpulrateavg + availableavg + courageousavg + efficientavg;
    totalCount += 6; 
});

const overallAverageRating = totalSum / totalCount;
  return {
    ...leader,
    rating:overallAverageRating,
  };
});
console.log(leadersWithRatings)

// const id=new mongoose.Types.ObjectId(viewer_id)
// const viewerConnections = await connections.findOne({user_id:id});
// const viewerConnectedIds = viewerConnections?.connections.map(connection => connection._id.toString()) || [];
// console.log(viewerConnectedIds)
// const leadersWithConnectionAndRequests = leadersWithRatings.map(leader => ({
//   ...leader,
//   isConnected: viewerConnectedIds.includes(leader.user_id._id.toString()),
//   isRequested: false, // Assuming no requests are checked initially
// }));
// await Promise.all(leadersWithConnectionAndRequests.map(async (leader) => {
//   const requestFilter = {
//     $and: [
//       { fromUser: viewer_id },
//       { toUser: leader.user_id },
//       { requestPending: true }
//     ]
//   };
//   const requestExists = await request.findOne(requestFilter);
//   leader.isRequested = !!requestExists;
// }));

const leadersWithConnectionAndRequests = await Promise.all(leadersWithRatings.map(async (leader) => {
  // Fetch connections for each leader
  const leaderConnections = await connections.findOne({ user_id: leader.user_id._id });
  const leaderConnectedIds = leaderConnections?.connections.map(connection => connection._id.toString()) || [];
  
  // Check if viewer is connected to this leader
  const isConnected = leaderConnectedIds.includes(viewer_id);

  // Assuming no requests are checked initially
  let isRequested = false;

  // If there's a request pending between viewer and leader, mark it as requested
  const requestFilter = {
    $and: [
      { fromUser: viewer_id },
      { toUser: leader.user_id._id },
      { requestPending: true }
    ]
  };
  const requestExists = await request.findOne(requestFilter);
  if (requestExists) {
    isRequested = true;
  }

  return {
    ...leader,
    isConnected,
    isRequested,
  };
}));

console.log(leadersWithConnectionAndRequests);


    return res.status(200).json({
      status: true,
      message: "Location Data Fetched Successfully",
      leaderlocation: leadersWithConnectionAndRequests,
    });
  } catch (err) {
    console.log('Error:', err);
    return res
      .status(500)
      .send({ status: false, message: err.message || 'Something went wrong' });
  }
};


// exports.nearbyleaders = async (req, res) => {
//   try {
//     const { latitude, longitude, updatedIds,viewer_id } = req.body;
//     const senderLocation = {
//       latitude: parseFloat(latitude),
//       longitude: parseFloat(longitude),
//     };
//     const userId = req.user ? req.user._id : null;

//     let leaderlocation = await location
//       .find({
//         "location.latitude": {
//           $gte: senderLocation.latitude - 0.045,
//           $lte: senderLocation.latitude + 0.045,
//         },
//         "location.longitude": {
//           $gte: senderLocation.longitude - 0.045,
//           $lte: senderLocation.longitude + 0.045,
//         },
//         user_id: { $ne: userId },
//       })
//       .sort({ _id: -1 })
//       .lean();
//       if (leaderlocation.length === 0) {
//         leaderlocation = await location
//           .find({
//             "location.latitude": {
//               $gte: senderLocation.latitude - 0.09,
//               $lte: senderLocation.latitude + 0.09,
//             },
//             "location.longitude": {
//               $gte: senderLocation.longitude - 0.09,
//               $lte: senderLocation.longitude + 0.09,
//             },
//             user_id: { $ne: userId },
//           })
//           .sort({ _id: -1 })
//           .lean();
//       }
//     // Use a Set to keep track of unique user IDs
//     const uniqueUserIds = new Set();

//     // Filter the leaderlocation array based on unique user IDs
//     const filtered = leaderlocation.filter((item) => {
//       const userIdString = item.user_id._id.toString();
//       if (!uniqueUserIds.has(userIdString) && userIdString !== updatedIds) {
//         uniqueUserIds.add(userIdString); 
//         return true;
//       }
//       return false;
//     });
// console.log(filtered)
// const leaderIds = filtered.map(item => item.user_id._id);
// const ratingsPromises = leaderIds.map(leaderId =>
//   RatingsReviews.find({ leader_id: leaderId }, { _id: 0, leader_id: 1, trustWorthy: 1,knowledgeable:1,helpful:1,
//   available:1,courageous:1,efficient:1 })
// );
// const ratingsResults = await Promise.all(ratingsPromises);

// // Calculate average ratings for each leader

// const leadersWithRatings = filtered.map((leader, index) => {
//   const trustWorthrate = ratingsResults[index].map(trustWorth => trustWorth.trustWorthy);
//   console.log(trustWorthrate)
//   const trustWorthrateavg = trustWorthrate.reduce((total, trustWorthy) => total + trustWorthy, 0) / trustWorthrate.length;
//   const knowledgeablerate = ratingsResults[index].map(knowledgeabl => knowledgeabl.knowledgeable);
//   const knowledgeablerateavg = knowledgeablerate.reduce((total, knowledgeable) => total + knowledgeable, 0) / knowledgeablerate.length;

//   const helpulrate = ratingsResults[index].map(helpu => helpu.helpful);
//   const helpulrateavg = helpulrate.reduce((total, helpful) => total + helpful, 0) / helpulrate.length;

//   const availablerate = ratingsResults[index].map(availabl => availabl.available);
//   const availableavg = availablerate.reduce((total, available) => total + available, 0) / availablerate.length;

//   const courageousrate = ratingsResults[index].map(courageou => courageou.courageous);
//   const courageousavg = courageousrate.reduce((total, courageous) => total + courageous, 0) / courageousrate.length;

//   const couefficient = ratingsResults[index].map(efficien => efficien.efficient);
//   const efficientavg = couefficient.reduce((total, efficient) => total + efficient, 0) / couefficient.length;
//   let totalSum = 0;
//   let totalCount = 0;
//   ratingsResults.forEach(rating => {
//     totalSum += trustWorthrateavg + knowledgeablerateavg + helpulrateavg + availableavg + courageousavg + efficientavg;
//     totalCount += 6; 
// });

// const overallAverageRating = totalSum / totalCount;
//   return {
//     ...leader,
//     rating:overallAverageRating,
//   };
// });
// console.log(leadersWithRatings)

// // const id=new mongoose.Types.ObjectId(viewer_id)
// // const viewerConnections = await connections.findOne({user_id:id});
// // const viewerConnectedIds = viewerConnections?.connections.map(connection => connection._id.toString()) || [];
// // console.log(viewerConnectedIds)
// // const leadersWithConnectionAndRequests = leadersWithRatings.map(leader => ({
// //   ...leader,
// //   isConnected: viewerConnectedIds.includes(leader.user_id._id.toString()),
// //   isRequested: false, // Assuming no requests are checked initially
// // }));
// // await Promise.all(leadersWithConnectionAndRequests.map(async (leader) => {
// //   const requestFilter = {
// //     $and: [
// //       { fromUser: viewer_id },
// //       { toUser: leader.user_id },
// //       { requestPending: true }
// //     ]
// //   };
// //   const requestExists = await request.findOne(requestFilter);
// //   leader.isRequested = !!requestExists;
// // }));

// const leadersWithConnectionAndRequests = await Promise.all(leadersWithRatings.map(async (leader) => {
//   // Fetch connections for each leader
//   const leaderConnections = await connections.findOne({ user_id: leader.user_id._id });
//   const leaderConnectedIds = leaderConnections?.connections.map(connection => connection._id.toString()) || [];
  
//   // Check if viewer is connected to this leader
//   const isConnected = leaderConnectedIds.includes(viewer_id);

//   // Assuming no requests are checked initially
//   let isRequested = false;

//   // If there's a request pending between viewer and leader, mark it as requested
//   const requestFilter = {
//     $and: [
//       { fromUser: viewer_id },
//       { toUser: leader.user_id._id },
//       { requestPending: true }
//     ]
//   };
//   const requestExists = await request.findOne(requestFilter);
//   if (requestExists) {
//     isRequested = true;
//   }

//   return {
//     ...leader,
//     isConnected,
//     isRequested,
//   };
// }));

// console.log(leadersWithConnectionAndRequests);


//     return res.status(200).json({
//       status: true,
//       message: "Location Data Fetched Successfully",
//       leaderlocation: leadersWithConnectionAndRequests,
//     });
//   } catch (err) {
//     console.log('Error:', err);
//     return res
//       .status(500)
//       .send({ status: false, message: err.message || 'Something went wrong' });
//   }
// };
exports.nearbycitizens = async (req, res) => {
  try {
    const { latitude, longitude, viewer_id } = req.body;
    const senderLocation = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    const userId = req.user ? req.user._id : null;
    const id = new mongoose.Types.ObjectId(viewer_id);
    const viewerConnections = await connections.findOne({ user_id: id });
    const viewerConnectedIds = viewerConnections?.connections.map(connection => connection._id.toString()) || [];
console.log(viewerConnectedIds)
    const citizenlocation = await locations.find({
      "location.latitude": {
        $gte: senderLocation.latitude - 0.045,
        $lte: senderLocation.latitude + 0.045,
      },
      "location.longitude": {
        $gte: senderLocation.longitude - 0.045,
        $lte: senderLocation.longitude + 0.045,
      },
      user_id: { $ne: userId },
    }).sort({ _id: -1 });

    const nearbyCitizensWithConnectionStatus = await Promise.all(citizenlocation.map(async citizen => {
      const leaderConnections = await connections.findOne({ user_id: citizen.user_id._id});
      const leaderConnectedIds = leaderConnections?.connections.map(connection => connection._id.toString()) || [];
      const isConnected = leaderConnectedIds.includes(viewer_id);

      const requestFilter = {
        $and: [
          { fromUser: viewer_id },
          { toUser: citizen.user_id },
          { requestPending: true }
        ]
      };
      const requestExists = await request.findOne(requestFilter);

      return {
        ...citizen.toObject(),
        isConnected,
        requestExists: !!requestExists
      };
    }));

    return res.status(200).json({
      status: true,
      message: "Location Data Fetched Successfully",
      citizenlocation: nearbyCitizensWithConnectionStatus,
    });
  } catch (err) {
    console.log('Error fetching nearby citizens', err);
    return res.status(500).send({
      status: false,
      message: err.message || 'Something went wrong',
    });
  }
};

exports.weShearOnOff = async (req, res) => {
  try {
      const { user_id, weShearOnOff } = req.body;
      if (!user_id) {
          return res.status(406).json({ status: 'Failure', message: 'user_id is a required field' });
      } else {
          const response = await citiZenUsermaster.findOneAndUpdate({ _id: user_id }, { $set: { weShearOnOff: weShearOnOff } }, { new: true });
          const response1 = await leaderUsermaster.findOneAndUpdate({ _id: user_id }, { $set: { weShearOnOff: weShearOnOff } }, { new: true });

          let result = [];
          if (response) {
              result.push(response);
          }
          if (response1) {
              result.push(response1);
          }

          return res.status(200).json({ status: true, message: 'toggleButton updated successfully', result });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Something went wrong' });
  }
};





// exports.weShearOnOff = async (req, res) => {
//   try {
//       const { user_id, toggleButton } = req.body;
//       if (!user_id) {
//           return res.status(406).json({ status: 'Failure', message: 'user_id is a required field' });
//       } else {
//           let UserModel;
//           if (req.url.includes('citizenusermasters')) {
//               UserModel = citiZenUsermaster;
//           } else if (req.url.includes('leaderusermasters')) {
//               UserModel = leaderUsermaster;
//           } else {
//               return res.status(404).json({ status: 'Failure', message: 'Invalid endpoint' });
//           }

//           const response = await UserModel.findOneAndUpdate({ _id: user_id }, { $set: { toggleButton: toggleButton } }, { new: true });
//           return res.status(200).json({ status: true, message: 'toggleButton updated successfully', response });
//       }
//   } catch (error) {
//       console.error(error);
//       return res.status(500).json({ status: false, message: 'Something went wrong' });
//   }
// };





exports.getAllCitizensapp = async (req, res) => {
  try {
    const { _id: viewer_id } = req.body;

  const response = await citiZenUsermaster.find({ /*profile: true*/ }).exec();
    const citizensWithConnectionsAndRequests = [];

    for (const citizen of response) {
      const leaderConnections = await connections.findOne({ user_id: citizen._id });
      const leaderConnectedIds = leaderConnections?.connections.map(connection => connection._id.toString()) || [];
      
      // Check if viewer_id exists in the leader's connections
      const isConnected = leaderConnectedIds.includes(viewer_id.toString());

      // Check if there's a request pending between the viewer and the citizen
      const requestFilter = {
        $and: [
          { fromUser: viewer_id },
          { toUser: citizen._id },
          { requestPending: true }
        ]
      };
      const requestExists = await request.findOne(requestFilter);

      citizensWithConnectionsAndRequests.push({
        ...citizen.toObject(),
        isConnected,
        requestExists: !!requestExists // Convert to boolean
      });
    }

    return res.status(200).json({ status: true, message: 'Fetched data successfully', citizensWithConnectionsAndRequests });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};



exports.getAllLeadersapp = async (req, res) => {
  try {
    const { _id: viewer_id } = req.body;
    const response = await leaderUsermaster.find({ /*profile: true*/ }).exec();
    const leadersWithConnectionsAndRequests = [];

    for (const leader of response) {
     
      const leaderConnections = await connections.findOne({ user_id: leader._id });
      const leaderConnectedIds = leaderConnections?.connections.map(connection => connection._id.toString()) || [];
      
      // Check if viewer_id exists in the leader's connections
      const isConnected = leaderConnectedIds.includes(viewer_id.toString());
      const requestFilter = {
        $and: [
          { fromUser: viewer_id },
          { toUser: leader._id },
          { requestPending: true }
        ]
      };
      const requestExists = await request.findOne(requestFilter);
      const allRatings = await RatingsReviews.find({ leader_id: leader._id }, { _id: 0, leader_id: 1, trustWorthy: 1, knowledgeable: 1, helpful: 1, available: 1, courageous: 1, efficient: 1 });
      let totalSum = 0;
      let totalCount = 0;

      allRatings.forEach(rating => {
        totalSum += (rating.trustWorthy || 0) + (rating.knowledgeable || 0) + (rating.helpful || 0) + (rating.available || 0) + (rating.courageous || 0) + (rating.efficient || 0);
        totalCount += 6;
      });

      // Calculate overall average rating
      const overallAverageRating = totalCount > 0 ? totalSum / totalCount : null;
      
      leadersWithConnectionsAndRequests.push({
        ...leader.toObject(),
        isConnected,
        requestExists: !!requestExists, // Convert to boolean,
        overallAverageRating
      });
    }

    return res.status(200).json({ status: true, message: 'Fetched data successfully', leadersWithConnectionsAndRequests });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};