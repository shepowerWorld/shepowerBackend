
const jwt = require('jsonwebtoken');
const HttpException = require('../utils/HttpException');
const { validUserMiddleware,
  validTempUserMiddleware,validAdminTempUserMiddleware } = require('../services/central.middleware');

  const authMiddleware = async (req, res, next) => {
    try {
      let token = '';
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        return res.status(400).send({ Status: false, message: 'Please login to access this resource' });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
      req.user = decoded;
  
      if (decoded.type === 'USER') {
        return validUserMiddleware(req, res, next);
      } else {
        return validAdminTempUserMiddleware(req, res, next);
      }
    } catch (err) {
      console.error('Error caught', err);
      return res.status(400).send({ Status: false, message: 'Please login to access this resource' });
    }
  };
  
  const authorizeMiddleware = (...roles) => {
    return (req, res, next) => {
      try {
        if (!roles.includes(req.user.userRole)) {
          return res.status(400).send({ Status: false, message: 'User is Unauthorized to Access this Resource' })
        }
        return next();
      } catch (error) {
        console.error('Error caught', error);
        return res.status(400).send({ Status: false, message: 'Unauthorized to access this resource' })
      }
    };
  };
  
  const authTempMiddleware = async (req, res, next) => {
    try {
      let token = '';
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        return res.status(400).send({ Status: false, message: 'Please login to access this resource'})
      }
  
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
      req.user = decoded;
  
      if (decoded.type === 'USER') {
        return validTempUserMiddleware(req, res, next);
      } else {
        return validAdminTempUserMiddleware(req, res, next);
      }
    } catch (error) {
      console.error('Error caught', error);
      return res.status(400).send({ Status: false, message: 'Please login to access this resource'})
    }
  };


  

module.exports = {
  authMiddleware,
  authorizeMiddleware,
  authTempMiddleware,
};

// const jwt = require('jsonwebtoken');
// const HttpException = require('../utils/HttpException');
// const { validUserMiddleware, validTempUserMiddleware, validAdminTempUserMiddleware } = require('../services/central.middleware');

// const authMiddleware = async (req, res, next) => {
//     try {
//         let token = '';
//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//             token = req.headers.authorization.split(' ')[1];
//         }

//         if (!token) {
//             return res.status(400).send({ Status: false, message: 'Please login to access this resource' });
//         }

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
//             req.user = decoded;

//             if (decoded.type === 'USER') {
//                 return validUserMiddleware(req, res, next);
//             } else {
//                 return validAdminTempUserMiddleware(req, res, next);
//             }
//         } catch (err) {
//             if (err.name === 'TokenExpiredError') {
//                 return res.status(401).send({ Status: false, message: 'Token expired' });
//             } else {
//                 throw err; // re-throw other errors
//             }
//         }
//     } catch (err) {
//         console.error('Error caught', err);
//         return res.status(500).send({ Status: false, message: 'Internal server error' });
//     }
// };

// const authorizeMiddleware = (...roles) => {
//     return (req, res, next) => {
//         try {
//             if (!roles.includes(req.user.userRole)) {
//                 return res.status(400).send({ Status: false, message: 'User is Unauthorized to Access this Resource' });
//             }
//             return next();
//         } catch (error) {
//             console.error('Error caught', error);
//             return res.status(400).send({ Status: false, message: 'Unauthorized to access this resource' });
//         }
//     };
// };

// const authTempMiddleware = async (req, res, next) => {
//     try {
//         let token = '';
//         if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//             token = req.headers.authorization.split(' ')[1];
//         }

//         if (!token) {
//             return res.status(400).send({ Status: false, message: 'Please login to access this resource' });
//         }

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
//             req.user = decoded;

//             if (decoded.type === 'USER') {
//                 return validTempUserMiddleware(req, res, next);
//             } else {
//                 return validAdminTempUserMiddleware(req, res, next);
//             }
//         } catch (error) {
//             console.error('Error caught', error);
//             return res.status(400).send({ Status: false, message: 'Please login to access this resource' });
//         }
//     } catch (error) {
//         console.error('Error caught', error);
//         return res.status(500).send({ Status: false, message: 'Internal server error' });
//     }
// };

// module.exports = {
//     authMiddleware,
//     authorizeMiddleware,
//     authTempMiddleware,
// };




