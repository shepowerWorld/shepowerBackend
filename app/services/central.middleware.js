const  HttpException  = require('../utils/HttpException');
const UserModel = require('../models/registrationcitizen');
const otherUsermodel = require('../models/registrationleader')
const Adminmodel = require('../models/admin')

const validUserMiddleware = async (req, res, next) => {
  const reqMethod = req.method;
  let user;
console.log(req.user.id)
  try {
    user = await UserModel.findById(req.user.id) || await otherUsermodel.findOne({_id:req.user.id})

console.log(user)
    if (!user ) {
      return res.status(400).send({ Status: false, message:  'Session expired! Please log in to continue'})
    }
    
    return next();
  } catch (error) {
    return res.status(400).send({ Status: false, message:  'Internal Server Error'})
  }
};


const validTempUserMiddleware = async (req, res, next) => {
  const reqMethod = req.method;
  let user;

  if (reqMethod !== 'GET') {
    try {
      user = await UserModel.findById(req.user.id) || await otherUsermodel.findOne({_id:req.user.id})
      
      if (user && user.isSuspended) {
        return res.status(400).send({ Status: false, message:  'Your account is suspended!'})
      }
      return next();
    } catch (error) {
      return res.status(400).send({ Status: false, message:  'Internal Server Error'})
    }
  }
  
  return next();
};

const validAdminTempUserMiddleware = async (req, res, next) => {
  const reqMethod = req.method;
  let user;

  if (reqMethod !== 'GET') {
    try {
      user = await Adminmodel.findById(req.user.id);
      
      if (user && user.isSuspended) {
        return res.status(400).send({ Status: false, message:  'Your account is suspended!'})
      }
      return next();
    } catch (error) {
      return res.status(400).send({ Status: false, message:  'Internal Server Error'})
    }
  }
  
  return next();
};


module.exports = {
  validUserMiddleware,
  validTempUserMiddleware,
  validAdminTempUserMiddleware,
};
