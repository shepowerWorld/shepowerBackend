const mongoose = require('mongoose');
const leaderUsermaster=require('../models/registrationleader')
const citiZenUsermaster=require('../models/registrationcitizen')
const jwtTokenService = require('../services/jwt-service')
const Admin=require('../models/admin')
const AddIntrest = require ('../models/category')
const Govscheme = require('../models/goverment_scheme');
const Notification = require ('../models/notificationMessage');
const SubIntrest = require('../models/subcategory')
const connection=require('../models/connection')
const PostBlock=require('../models/postBlock')
const {CreateGroup}=require('../models/groupChatmodule')
const eventSchema=require('../models/event')
const faqSchema = require ('../models/faq')
const sosSchema=require('../models/sos')
const Languages = require ('../models/language')
const TermsAndConditions = require ('../models/termsAndConditions')
const PrivacyPolicy = require ('../models/PrivacyPolicy')
const { text } = require('body-parser')
const language = require('../models/language')
const AboutApp = require('../models/aboutApp')
const postSchema=require('../models/posts')
const weshareSchema=require('../models/weshare')
const {generateAdminTokensObject,generateAdminTokenPayload,generateUserTokenPayload,generateTokensObject } = require("../services/token.helper");
const jwt = require('jsonwebtoken');
const goverment_scheme = require('../models/goverment_scheme');
const s3 = require("../middleware/s3custom")






exports.adminRegistration = async (req, res) => {
    try {
      const { userName, password } = req.body;
      const existingAdmin = await Admin.findOne({ userName:userName,password:password });
      if (existingAdmin) {
        return res.status(409).json({  status:false,message: 'Admin already exists' });
      }
  else{
      const newAdmin = new Admin({
        userName:userName,
        password:password,
      });
  
     const response= await newAdmin.save();
     const tokenPayload = generateAdminTokenPayload(response);
     const tokens = generateAdminTokensObject(tokenPayload);
  
      return res.status(200).json({ status:true, message: 'Admin registered successfully',response,tokens });
    } 
  }catch (error) {
      console.log(error)
      return res.status(500).json({status:'eroor', message: 'Internal server error' });
    }
  };


exports.adminLogin = async (req, res) =>{
    try {
      const { userName, password } = req.body;
      const admin = await Admin.findOne({ userName :userName,password:password});
      if (!admin) {
        return res.status(401).json({ status:false, message: 'Authentication failed' });
      }else{
        const tokenPayload = generateAdminTokenPayload(admin);
        const tokens = generateAdminTokensObject(tokenPayload);
          return res.status(200).json({ status:true,message: 'logged in successfully',admin ,tokens});
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status:'eroor' ,message: 'Internal server error' });
    }
  };


exports.getAllUsers = async (req, res) => {
    try {
        const userResponse = await citiZenUsermaster.find({profile:true}).sort({ createdAt: -1 });
        const leaderResponse = await leaderUsermaster.find({profile:true}).sort({ createdAt: -1 });
        const response= userResponse.concat(leaderResponse)
        return res.status(200).json({status: true,message:'data fetched successfully',response});
      } catch (error) {
        console.log(error)
        return res.status(500).json({ status:'eroor' ,message: 'Internal server error' });
      }
};





exports.createGovScheme = async (req, res) => {
  try {
    const { States_or_union_territories, policy_page_link, locationType } = req.body;

    if (!States_or_union_territories || !policy_page_link || !locationType) {
      return res.status(400).json({ status: false, message: "Please provide all the required fields" });
    }

    const existingScheme = await Govscheme.findOne({ States_or_union_territories });

    if (existingScheme) {
      return res.status(400).json({
        status: false,
        message: `The '${States_or_union_territories}' already exists.`
      });
    }

    const newGovScheme = new Govscheme({
      States_or_union_territories,
      policy_page_link,
      locationType,
    });

    await newGovScheme.save();
    res.status(201).json({ status: true, message: "Gov scheme created successfully", data: newGovScheme });
  } catch (err) {
    console.error("Error creating gov scheme:", err);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};


exports.getAllStatesGovSchemes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const govSchemes = await Govscheme.find({ locationType: 'state' })
      .skip(skip)
      .limit(limit);

    const total = await Govscheme.countDocuments({ locationType: 'state' });

    if (!govSchemes || govSchemes.length === 0) {
      return res.status(404).json({ status: false, message: "No state gov schemes found" });
    }

    res.status(200).json({
      status: true,
      message: "State gov schemes retrieved successfully",
      data: govSchemes,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit), 
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    console.error("Error fetching state gov schemes:", err);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};



exports.getAllTerritoryGovSchemes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const govSchemes = await Govscheme.find({ locationType: 'territory' })
      .skip(skip)
      .limit(limit);

    const total = await Govscheme.countDocuments({ locationType: 'territory' });

    if (!govSchemes || govSchemes.length === 0) {
      return res.status(404).json({ status: false, message: "No territory gov schemes found" });
    }

    res.status(200).json({
      status: true,
      message: "Territory gov schemes retrieved successfully",
      data: govSchemes,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit), 
        currentPage: page,
        itemsPerPage: limit
      }
    });
  } catch (err) {
    console.error("Error fetching territory gov schemes:", err);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};


exports.updateGovScheme = async (req, res) => {
  try {
    const { _id } = req.params;
    const { States_or_union_territories, policy_page_link , locationType } = req.body;

    const result = await Govscheme.findOneAndUpdate(
      { _id }, // Filter by _id
      { $set: { States_or_union_territories, policy_page_link , locationType} }, // Update the fields
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ status: false, message: "Gov scheme not found" });
    }

    res.status(200).json({
      status: true,
      message: "Gov scheme updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error updating gov scheme:", err);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

exports.getGovSchemeById = async (req, res) => {
  try {
    const { _id } = req.params;
    const govScheme = await Govscheme.findOne({_id : _id});

    if (!govScheme) {
      return res.status(404).json({ status: false, message: "Gov scheme not found" });
    }

    res.status(200).json({
      status: true,
      message: "Gov scheme retrieved successfully",
      data: govScheme,
    });
  } catch (err) {
    console.error("Error fetching gov scheme by ID:", err);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

exports.deleteGovScheme = async (req, res) => {
  try {
    const { _id } = req.params;
    const deletedGovScheme = await Govscheme.findOneAndDelete({_id : _id});

    if (!deletedGovScheme) {
      return res.status(404).json({ status: false, message: "Gov scheme not found" });
    }

    res.status(200).json({
      status: true,
      message: "Gov scheme deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting gov scheme:", err);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
};





exports.createNotification = async (req, res) => {
  try {
      const { title, message , filepath} = req.body;

      if (!title || !message || !filepath)  {
          return res.status(400).json({ success: false, message: 'Title and message are required.' });
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 5);

      const notification = new Notification({
          title,
          message,
          file_path: filepath,
          expires_at: expiresAt,
      });

      await notification.save();

      return res.status(201).json({
          success: true,
          message: 'Notification created successfully!',
          data: notification,
      });
  } catch (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.getActiveNotifications = async (req, res) => {
  try {
      const now = new Date();
      const activeNotifications = await Notification.find({
          status: 'ACTIVE',
          expires_at: { $gt: now }, 
      });

      return res.status(200).json({
          success: true,
          message: 'Active notifications fetched successfully!',
          data: activeNotifications,
      });
  } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.deactivateExpiredNotifications = async () => {
  try {
      const now = new Date();
      await Notification.updateMany(
          { status: 'ACTIVE', expires_at: { $lte: now } },
          { $set: { status: 'INACTIVE' } }
      );
      console.log('Expired notifications deactivated successfully.');
  } catch (error) {
      console.error('Error deactivating expired notifications:', error);
  }
};


exports.updateNotification = async (req, res) => {
  try {
      const { id } = req.params;
      const { title, message, status } = req.body;

      const notification = await Notification.findOne({ _id : id});
      if (!notification) {
          return res.status(404).json({ success: false, message: 'Notification not found.' });
      }


      // Update fields if provided
      if (title) notification.title = title;
      if (message) notification.message = message;
      if (status) notification.status = status;

      const notifications = await Notification.findOneAndUpdate(
        { _id: id },
        {$set : { title : title , message: message , status: status}},
        {new : true}
      )


      if (!notifications) {
        return res.status(404).json({ success: false, message: 'Notification Update Failed.'});
    }

      return res.status(200).json({
          success: true,
          message: 'Notification updated successfully!',
          data: notification,
      });
  } catch (error) {
      console.error('Error updating notification:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.getNotificationById = async (req, res) => {
  try {
      const { id } = req.params;

      const notification = await Notification.findOne({_id : id});
      if (!notification) {
          return res.status(404).json({ success: false, message: 'Notification not found.' });
      }

      return res.status(200).json({
          success: true,
          message: 'Notification fetched successfully!',
          data: notification,
      });
  } catch (error) {
      console.error('Error fetching notification:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.updateSosStatus = async (req, res) => {
  try {
    const { _id, status } = req.body;

    if (!_id || !status) {
      return res.status(400).json({ status: false, message: "Please provide _id and status" });
    }

    // const objectId = mongoose.Types.ObjectId.isValid(_id) ? mongoose.Types.ObjectId(_id) : null;

    const updatedProfile = await leaderUsermaster.updateOne(
      { _id: _id },
      { $set: { sos_status: status } }
    );




    if (!updatedProfile) {
      return res.status(404).json({ status: false, message: "Profile not found" });
    }


    const findUpdatedProfile = await leaderUsermaster.findOne({_id});

    console.log(findUpdatedProfile, "*********##############3");
    



    res.status(200).json({
      status: true,
      message: `Profile status updated to ${status}`,
      data: findUpdatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile status:", error);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
}







exports.newusers = async (req, res) => {
    try {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000); // Calculate the date 24 hours ago
  
      const count1 = await citiZenUsermaster.countDocuments({
        profile: true,
        createdAt: {
          $gte: twentyFourHoursAgo,
          $lt: now
        }
      });
      const count2= await leaderUsermaster.countDocuments({
        profile: true,
        createdAt: {
          $gte: twentyFourHoursAgo,
          $lt: now
        }
      });
  const count=count1+count2
      res.json({ count });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status:'eroor' ,message: 'Internal server error' });
    }
  };
exports.totalUsersCount = async (req, res) => {
    try {
        const leaderUsermasters = await leaderUsermaster.find({profile:true}).count()
        const citiZenUsermasters = await citiZenUsermaster.find({profile:true}).count()
        const totalUsersCount = citiZenUsermasters+leaderUsermasters
        return res.status(200).json({status:true,message:"total counts of users",totalUsersCount});
      } catch (error) {
        console.log(error)
        return res.status(500).json({ status:'eroor' ,message: 'Internal server error' });
      }
    }; 


exports.getAllCitizens= async (req, res)=>{
    try{
    const response = await citiZenUsermaster.find({profile:true}).exec();
    return res.status(200).json({status:true,message:'fetched data successfully',response})
    }catch(error){
        console.log(error)
        return res.status(500).json({status:false,message:error.message});
    }
};
exports.totalCitizensCount = async (req, res)=>{
    try{
    const totalCitizensCount = await citiZenUsermaster.find({profile:true}).count()

    return res.status(200).json({status:true,message:"total counts of users",totalCitizensCount});
    }catch(error){
      console.log(error)
      return res.status(500).json({status:false,message:error.message});
    }
};
exports.totalLeaderCount = async (req, res)=>{
    try{
    const totalLeaderCount = await leaderUsermaster.find({profile:true}).count()
    return res.status(200).json({status:true,message:"total counts of users",totalLeaderCount});
    }catch(error){
      console.log(error)
      return res.status(500).json({status:false,message:error.message});
    }
};
exports.getAllLeaders = async (req, res)=>{
    console.log(req.body);
    try {
        const getAllLeaders = await leaderUsermaster.find({profile:true});
        return res.status(200).json({status:true,message:"total counts of users",getAllLeaders});
        }catch(error){
          console.log(error)
    return res.status(500).json({status:false,message:error.message});
        }
};


 exports.addCategory= async (req , res)=> {
  try{


    if(!req.body.name){
    res.status(400).send({status:false,message:"Content can not be empty!"});
    
    }
    const count=await AddIntrest.count()
    console.log(count)
    if(count<7){
    const addIntrest = new  AddIntrest({
        name : req.body.name,
    });
    await addIntrest.save().then((data)=>{
      return res.send({
        status:true,
        message:"Category created successfully!!",
        stored:data
    });
    
    }).catch(err => {

        res.status(500).send({
            message: err.message || "Some error occurred while creating user"
        });
    });
    
    
    }else{
      res.status(500).send({
        status:false,
        message:"reached maximun count",
    });
    }
  }catch(error){
      console.log(error)
      return res.status(500).json({status:false,message:error.message});
    }
}
  exports.getCategory = async (req, res)=>{
    try{
const intrest = await AddIntrest.find();
return res.send({status:true,message:'category fetched',intrest});
    }catch(error){
      console.log(error)
      return res.status(500).json({status:false,message:error.message});
    }
};
 exports.updateCategory= async (req , res)=> {
  try{
    if(!req.body){
      return   res.status(400).send({
           status:false, message:"Data to update can not be empty!"
        });
    }
    const id = req.body.id;
    await AddIntrest.findByIdAndUpdate(id, req.body , {new:true}).then(data=>{
            if(!data){
                res.status(404).send({
    message:'CategoryDetails not found.'
                });
            }else{
              return res.send({
                status:true,
                    message:"Category Updated successfully." ,data
                })
            }
        }).catch(err=>{
            res.status(500).send({
                message:err.message
            });
        });
                
            }catch{
              console.log(error)
      return res.status(500).json({status:false,message:error.message});
            }
}
exports.deleteCategory = async (req, res) => {
                try {
                  const deletedIntrest= await AddIntrest.findByIdAndRemove(req.params.id);
                  console.log("deletedCategory - -",deletedIntrest);
                  
                  if (!deletedIntrest) {
                    return res.status(404).send({
                      message: 'Category not found.'
                    });
                  }
              
                  await SubIntrest.deleteMany ({addIntrest_id:req.params.id});
                  
                 
                  const deletedAddIntrestDetails = {
                    id: deletedIntrest._id,
                    name: deletedIntrest.name,
                  };
              
                  return res.send({
                    message: 'Category and its SubCategory deleted successfully!',
                    deletedIntrest: deletedAddIntrestDetails
                  });
                } catch (err) {
                    console.log(err)
                    return res.status(500).json({status:false,message:err.message});
                }
};
exports.addSubCategory= async (req , res)=> {
                if(!req.body.name){
                res.status(400).send({message:"Content can not be empty!"});
                
                }
                const addSubIntrest = new  SubIntrest({
                    name : req.body.name,
                    addIntrest_id : req.body.addIntrest_id,
               
                
                });
                await addSubIntrest.save().then((data)=>{
                res.send({
                    message:"SubCategory created successfully!!",
                    stored:data
                });
                
                }).catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating user"
                    });
                });
                
                
};
exports.getSubCategory = async (req, res)=>{
  try {
    const allCategories = await AddIntrest.find({});
    const categoryList = [];

    for (const category of allCategories) {
      const subIntrests = await SubIntrest.find({ addIntrest_id: category._id });
      const subcategories = subIntrests.map(subIntrest => ({
        id: subIntrest._id,
        name: subIntrest.name
      }));

      categoryList.push({
        category: {
          id: category._id,
          name: category.name
        },
        subcategories
      });
    }

   return res.status(200).json({categoryList});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateSubCategory = async (req, res) => {
        try {
            const id = req.body.id;
            const updatedSubInterest = await SubIntrest.findByIdAndUpdate(id, req.body, {
                new: true,
                useFindAndModify: false
            });
    
            if (!updatedSubInterest) {
                return res.status(404).json({
                  ststua:false,
                    message: 'SubCategory not found.'
                });
            }
    
            res.status(200).json({
              status:true,
                message: 'SubCategory updated successfully.',
                data: updatedSubInterest
            });
        } catch(err){
          console.log(err)
          return res.status(500).json({status:false,message:err.message});
        }
};
exports.deleteSubCategory = async (req, res) => {
    try {
      const deletedsubInterest = await SubIntrest.findByIdAndRemove(req.params.id);
      
      if (!deletedsubInterest) {
        return res.status(404).send({
          status:false,
          message: 'deletedsubInterest not found.'
        });
      }
  
     
      const deletedsubInterestDetails = {
        id: deletedsubInterest._id,
        name: deletedsubInterest.name,
      };
  
      return res.status(200).json({
        status:true,
        message: 'SubCategory deleted successfully!',
        deletedsubInterest: deletedsubInterestDetails
      });
    }  catch(err){
      console.log(err)
      return res.status(500).json({status:false,message:err.message});
    }
};
exports.adminBlock = async (req, res) => {
    try {
        const { _id } = req.body;
        
        const citizen = await citiZenUsermaster.findOne({ _id:_id });
        console.log("citize --",citizen)
        const leader = await leaderUsermaster.findOne({ _id:_id });
        console.log("leader --",leader)
        if (!citizen && !leader) {
            return res.status(401).json({ status: false, message: "User Not Found" });
        }
        
        let response;
        let statusMessage;

        if (citizen) {
             if (citizen.adminBlock === true){
              response = await citiZenUsermaster.findByIdAndUpdate(
                
                    _id ,
                    { $set: { adminBlock:false} },
                    { new: true }
                );
                statusMessage = "Citizen Un-Blocked Successfully";
            } else {
              response = await citiZenUsermaster.findByIdAndUpdate(
                     _id ,
                    { $set: { adminBlock: true } },
                    { new: true }
                );
                statusMessage = "Citizen Blocked Successfully";
            }
        }
        else if (leader) {
            if (leader.adminBlock === true){
              response = await leaderUsermaster.findByIdAndUpdate(
                _id ,
                    { $set: { adminBlock:false} },
                    { new: true }
                );   statusMessage = "Leader Un-Blocked Successfully";
            } else {
               
              response = await leaderUsermaster.findByIdAndUpdate(
                     _id ,
                    { $set: { adminBlock: true } },
                    { new: true }
                );
                statusMessage = "Leader Blocked Successfully";
            }
        }
        return res.status(200).json({ status: true, message: statusMessage, response });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: "Something went wrong", error });
    }
};
exports.connectionsOfAll = async (req, res) => {
  try {
    const users1 = await leaderUsermaster.find({ profile: true }, { _id: 1, firstname: 1, profile_img: 1 });
    const users2 = await citiZenUsermaster.find({ profile: true }, { _id: 1, firstname: 1, profile_img: 1 });
    const users = [...users1, ...users2];

    if (users) {
      const result = await Promise.all(
        users.map(async (user) => {
          const connections = await connection.find({ user_id: user._id }, { connections: 1, _id: 0 });

          const mappedConnections = connections
            .map((conn) => conn.connections)
            .flat() // Flatten the array of connections
            .filter((conn) => conn !== null && conn !== undefined);

          const totalConnections = mappedConnections.length;

          return {
            _id: user._id,
            firstname: user.firstname,
            profile_img: user.profile_img,
            connections: mappedConnections,
            totalConnections,
          };
        })
      );

      res.send({ status: true, message: "Get Data Successfully", result });
    } else {
      res.status(401).send({ message: "No data available" });
    }
  } catch (err) {
    res.send({ message: "Something went wrong" });
  }
};
exports.postOfOfAll = async (req, res) => {
  try {
    const users1 = await leaderUsermaster.find({ profile: true }, { _id: 1, firstname: 1, profile_img: 1 });
    const users2 = await citiZenUsermaster.find({ profile: true }, { _id: 1, firstname: 1, profile_img: 1 });
    const users = [...users1, ...users2];
    if (users) {
      const result = await Promise.all(
        users.map(async (user) => {
          const posts = await postSchema.find({ user_id: user._id }, { Post: 1, _id: 0 ,Post_discription:1,totallikesofpost:1,totalcomments:1});
          const totalposts = posts.length;
          return { _id: user._id, firstname: user.firstname, profile_img: user.profile_img, posts, totalposts };
        })
      );
      res.send({ status: true, message: "Get Data Successfully", result });
    } else {
      res.status(401).send({ message: "No data available" });
    }
  } catch (err) {
    console.log(err)
    res.send({ message: "Something went wrong" });
  }
}
exports.groupCount = async(req,res)=>{
try {
   const count=await CreateGroup.find().count()
   console.log(count)
   if(count){
    return res.send({ status: true, message: "Get Data Successfully", count });
   }else{
    return res.status(401).send({ status: false, message:"No data available" });
   }
} catch (err) {
  console.log(err)
  return res.send({ message: "Something went wrong" });
}
}
exports.groupmanagement=async(req,res)=>{
  try {
    const response=await CreateGroup.find({})
    if(response){
      return res.send({ status: true, message: "Get Data Successfully", response });
     }else{
      return res.status(401).send({ status: false, message:"No data available" });
     }
 } catch (err) {
   console.log(err)
   return res.send({ message: "Something went wrong" });
 }
}

// exports.eventAll=async(req,res)=>{
//   try {
//     const response=await eventSchema.find({})
//     console.log("response -- ",response);
//     if(response){
//       return res.status(200).send({ status: true, message: "Get Data Successfully", response });
//      }else{
//       return res.status(401).send({ status: false, message:"No data available" });
//      }
//  } catch (err) {
//    console.log(err)
//    return res.status(500).send({ message: "Something went wrong" });
//  }
// }
exports.allEvents=async(req,res)=>{
  try {
    const response = await eventSchema.find({});

    if (response) {
      return res.send({ status: true, message: "Get Data Successfully", response });
    } else {
      return res.status(401).send({ status: false, message: "No data available" });
  }
 } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, message: "Something went wrong" });
  }
}
exports.groupBlockUnblock=async(req,res)=>{
  try {
    const {_id} = req.body
    const group=await CreateGroup.findOne({_id:_id})
    if(group.adminBlock == true){
      const response=await CreateGroup.findOneAndUpdate({_id:_id},{$set:{adminBlock:false}},{new:true})
      return res.status(200).send({ status: true, message: "Group Un-Blocked Succesfully" });
    }else{
       const response=await CreateGroup.findOneAndUpdate({_id:_id},{$set:{adminBlock:true}},{new:true})
      return res.status(200).send({ status: true, message:"Group Blocked Succesfully" });
     }
 } catch (err) {
   console.log(err)
   return res.status(500).send({ message: "Something went wrong" });
 }
}


// exports.addFAQ = async(req, res)=>{




// }
exports.addFAQ = async (req, res) => {
  try {
    const { Question, Answer } = req.body;

    if (!Question || !Answer) {
      return res.status(400).send({ status: false, message: "Question and Answer are required!" });
    }

    const FAQ = new faqSchema({
      Question: Question,
      Answer: Answer,
    });

    const savedFAQ = await FAQ.save();

    return res.status(200).send({
      status: true,
      message: "FAQ created successfully!",
      stored: savedFAQ,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send({ status: false, message: "Something went wrong", error: error.message });
  }
};


exports.updateFAQ = async (req, res) => {
  try {
    const { _id, Question, Answer } = req.body;

    if (!_id || !Question || !Answer) {
      return res.status(400).send({ status: false, message: "Please Fill All The Fields!" });
    }

    const updatedFAQ = await faqSchema.findByIdAndUpdate(_id, { Question, Answer }, { new: true });

    if (!updatedFAQ) {
      return res.status(404).send({ status: false, message: "FAQ not found with the specified ID." });
    }

    return res.status(200).send({
      status: true,
      message: "FAQ updated successfully!",
      updated: updatedFAQ,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send({ status: false, message: "Something went wrong", error: error.message });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({ status: false, message: "please provied proper details" });
    }

    const deleteFAQDetails = await faqSchema.findByIdAndDelete(id);

    if (!deleteFAQDetails) {
      return res.status(404).send({ status: false, message: "FAQ not found for deletion." });
    }

    return res.status(200).send({
      status: true,
      message: "FAQ deleted successfully!",
      deletedFAQDetails: {
        id: deleteFAQDetails.id,
        Question: deleteFAQDetails.Question,
        Answer: deleteFAQDetails.Answer,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getFAQ =async(req, res)=>{
  try{
  const FAQ = await faqSchema.find();
  return res.status(200).send({ status: true, message: "FAQ fetched successfully",FAQ  });
   } catch (error) {
      console.error('Error:', error);
      return res.status(500).send({ status: false, message: "Something went wrong", error: error.message });
    }
  
  }
exports.getSosAdmin=async(req,res)=>{
  try{
const result=await sosSchema.find()
console.log(result)
return res.status(200).send({ status: true, message:"Sos Data Fetched Succesfully",result});
} catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
}


exports.getPostBlock=async(req,res)=>{
  try{
const result=await PostBlock.find()
console.log(result)
return res.status(200).send({ status: true, message:"Post Blocked Data Fetched Succesfully",result});
} catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, message: "Internal Server Err" });
  }
}



exports.addLanguages = async (req, res) => {
  try {
    const { languages } = req.body;

    if (!languages) {
      return res.status(400).send({ status: false, message: "Content can not be empty!" });
    } else {
      const language = new Languages({
        languages: req.body.languages,
      });

      const data = await language.save();
      return res.send({
        status: true,
        message: "Languages created successfully!!",
        stored: data,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Something went wrong" });
  }
};

exports.updateLanguages = async (req, res) => {
  try {
    const { languages_id, languages } = req.body;

    if (!languages_id || !languages) {
      return res.status(400).json({ Status: false, message: 'Please fill all the fields' });
    }

    const languagedata = await Languages.findByIdAndUpdate(
      { _id: languages_id },
      { $set: { languages: languages } },
      { new: true }
    );

    if (!languagedata) {
      return res.status(400).json({ Status: false, message: 'Languages not found' });
    } else {
      return res.status(200).json({ Status: true, message: 'Languages updated successfully.', languagedata });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Status: false, message: "Something went wrong" });
  }
};


exports.deleteLanguage = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).send({ status: false, message: "please provied proper details" });
    }

    const deleteLanguageDetails = await Languages.findByIdAndDelete(id);

    if (!deleteLanguageDetails) {
      return res.status(404).send({ status: false, message: "terms not found for deletion." });
    }

    return res.status(200).send({
      status: true,
      message: "delete Language successfully!",
      deleteLanguageDetails: {
        id: deleteLanguageDetails.id
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

  


exports.addTAC = async (req, res) => {
  try {
    const { text } = req.body;
   
    if (!text) {
      return res.status(400).json({  status:false,message: 'please provide Text ' });
    }

    const existingTAC  = await TermsAndConditions.findOne({ text:text});
    if (existingTAC) {
      return res.status(400).json({ status: false, message: 'Text already exists' });
    } else {
      const newTAC = new TermsAndConditions({
        text: text
      });

      const response = await newTAC.save();

      return res.status(200).json({ status: true, message: 'Terms and Conditions added successfully', response });
    }
}catch (error) {
    console.log(error)
    return res.status(500).json({status:'error', message: 'Internal server error' });
  }
};


exports.getAllTAC=async(req,res)=>{
  try{
const result=await TermsAndConditions.find()
console.log(result)
return res.status(200).send({ status: true, message:"TermsAndConditions Data Fetched Succesfully",result});
} catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
}

// exports.updateTAC = async (req, res) => {
//   try {
//     const _id = req.body._id;
//     const updatedTAC = await TermsAndConditions.findByIdAndUpdate(_id, req.body, {
//       new: true
//     });

//     if (!updatedTAC) {
//       return res.status(404).send({ status: false, message: "TAC Not Found" });
//     }else{
//       return res.status(200).send({
//         status: true,
//         message: "TAC Updated Successfully",
//         data: updatedTAC
//       })
//     }

//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({ status: false, message: "Internal Server Error" });
//   }
// };


exports.updateTAC = async (req, res) => {
  try {
    const _id = req.body._id;
    const text = req.body;

    if (!_id) {
      return res.status(400).send({ status: false, message: "Please provide _id" });
    }


    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ status: false, message: "No update fields provided" });
    }

    const updatedTAC = await TermsAndConditions.findByIdAndUpdate(_id, req.body, {
      new: true
    });

    if (!updatedTAC) {
      return res.status(404).send({ status: false, message: "TAC Not Found" });
    } else {
      return res.status(200).send({
        status: true,
        message: "TAC Updated Successfully",
        data: updatedTAC
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};


exports.deleteTAC = async (req, res) => {
  try {
    const deleteTACDetails = await TermsAndConditions.findByIdAndRemove(req.params.id);
    
    if (!deleteTACDetails) {
      return res.status(400).send({status: false,message:"Content can not be empty!"});

    }else{
      res.send({
        message: 'TACDetails deleted successfully!',
        deletedFAQDetails: {
          id: deleteTACDetails.id,
          text: deleteTACDetails.text,
          
        }
      })
    }
   
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};

///////////////--------------------------------------------------------------------Privacy Policy------------------------------------------///


exports.addPAP = async (req, res) => {
  try {
    const { text } = req.body;
   
    if (!text) {
      return res.status(400).json({  status:false,message: 'please provide Text ' });
    }

    const existingPAP  = await PrivacyPolicy.findOne({ text:text});
    if (existingPAP) {
      return res.status(400).json({ status: false, message: 'Text already exists' });
    } else {
      const newPAP = new PrivacyPolicy({
        text: text
      });

      const response = await newPAP.save();

      return res.status(200).json({ status: true, message: ' PrivacyPolicy added successfully', response });
    }
}catch (error) {
    console.log(error)
    return res.status(500).json({status:'error', message: 'Internal server error' });
  }
};


exports.getAllPAP=async(req,res)=>{
  try{
const result=await PrivacyPolicy.find()
console.log(result)
return res.status(200).send({ status: true, message:"PrivacyPolicy Data Fetched Succesfully",result});
} catch (err) {
    console.error(err);Terms
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
}



exports.updatePAP = async (req, res) => {
  try {
    const _id = req.body._id;
    const text = req.body;

    if (!_id) {
      return res.status(400).send({ status: false, message: "Please provide _id" });
    }


    if (Object.keys(req.body).length === 0) {
      return res.status(400).send({ status: false, message: "No update fields provided" });
    }

    const updatedPAP = await PrivacyPolicy.findByIdAndUpdate(_id, req.body, {
      new: true
    });

    if (!updatedPAP) {
      return res.status(404).send({ status: false, message: "PAP Not Found" });
    } else {
      return res.status(200).send({
        status: true,
        message: "PrivacyPolicy Updated Successfully",
        data: updatedPAP
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, message: "Internal Server Error" });
  }
};


exports.deletePAP = async (req, res) => {
  try {
    const deletePAPDetails = await PrivacyPolicy.findByIdAndRemove(req.params.id);
    
    if (!deletePAPDetails) {
      return res.status(400).send({status: false,message:"Content can not be empty!"});

    }else{
      res.send({
        message: 'PrivacyPolicy Details deleted successfully!',
        deletePAPDetails: {
          id: deletePAPDetails.id,
          text: deletePAPDetails.text,
          
        }
      })
    }
   
  } catch (err) {
    return res.status(500).send({ message: "Something went wrong" });
  }
};




exports.addAboutApp = async (req, res) => {
  try {
    const {AppName,AppVersion,Description } = req.body;
if (!AppName|| !AppVersion||!Description ) {
      return res.status(406).send({ status: false, message: 'All parameters are required fields' });
    }
    const appdata = await AboutApp.find();
  if(appdata.length>0){
    res.send({ status: true, message: 'AboutApp Already Exist', AboutApp:appdata });
  }  
  else{
    const Appdata = new AboutApp({
      AppName:AppName,
      AppVersion:AppVersion,
      Description:Description,
  });
  await Appdata.save();
      res.send({ status: true, message: 'About App Added Successfully', AboutApp:Appdata });
    } 
  }catch (err) {
      console.log('Registration error', err);
      return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
    }
  };  


exports.updateAboutApp = async (req, res) => {
    try {
      const {About_id,AppName,AppVersion,Description} = req.body;
    
if (!AppName|| !AppVersion||!Description ) {
        return res.status(400).json({ Status: false, message: 'Please Fill All The Fields' });
      }
const appdata = await AboutApp.findOneAndUpdate({_id:About_id },{ $set: { AppName:AppName,AppVersion:AppVersion,Description:Description } },
      { new: true }
  );
  if (!appdata) {
    res.status(404).send({ message: `AboutApp not found.` });
}            
else {
  res.send({Status:true, message: 'AboutApp Updated Successfully.', appdata });
}

} catch (error) {
console.log('Error:', error);
res.status(500).send({ message: "Something went wrong", error });
}
};  

exports.deleteAboutApp = async (req, res) => {
  
const {About_id} = req.body;
try {
const appdata = await AboutApp.findOneAndDelete({ _id:About_id},
      { new: true }
  );
  if (!appdata) {
      res.status(404).send({ message: `AboutApp not found.` });
  } else {
      res.send({ message: "AboutApp Deleted Successfully.", appdata });
  }
} catch (error) {
  console.log('Error:', error);
  res.status(500).send({ message: "Something went wrong", error });
}
};

exports.getAboutApp = async (req, res) => {
try {
  const appdata = await AboutApp.find();
 
  res.status(200).json({Status:true,message:"About App fetched successfully",appdata});
} catch (error) {
  res.status(404).json({ message: error.message });
}
};



exports.getAllShareCitizen = async (req, res) => {
  try {
    const response = await weshareSchema.find();

    if (response) {
      // Filter the response to include only data with profileID starting with "citizen"
      const filteredData = response.filter(item => item.userdeatils.profileID.startsWith('citizen'));

      return res.status(200).json({ Status: true, message: "weshare fetched successful", response: filteredData });
    } else {
      return res.status(400).json({ Status: false, message: "error while fetching sos" });
    }
  } catch (err) {
    console.log('find error', err);
    return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
  }
};

exports.getAllShareLeader = async (req, res) => {
  try {
    const response = await weshareSchema.find();

    if (response) {
      // Filter the response to include only data with profileID starting with "citizen"
      const filteredData = response.filter(item => item.userdeatils.profileID.startsWith('Leader'));

      return res.status(200).json({ Status: true, message: "weshare fetched successful", response: filteredData });
    } else {
      return res.status(400).json({ Status: false, message: "error while fetching sos" });
    }
  } catch (err) {
    console.log('find error', err);
    return res.status(500).send({ status: false, message: err.message || 'Something went wrong' });
  }
};



exports.uploadShepowerFile = function (req, res) {
  let path = 'shepower/notification/image/';
  return s3.uploadFileToBucket(req, res, path);
}