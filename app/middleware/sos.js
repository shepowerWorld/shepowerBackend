// const AWS = require('aws-sdk');
// const sharp = require('sharp');
// const { promisify } = require('util');
// const multer = require('multer');
// const path = require('path')
// const ffmpeg = require('fluent-ffmpeg');
// const attachments = multer();
// const s3 = new AWS.S3({
//     accessKeyId: "AKIAWYY5W6WU47T5I63Z",
//   secretAccessKey:"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",
//     region: "us-east-1"
//   });



// const compressedattachments = async (req, res, next) => {
//     try {
//       if (!req.file) {
//         // If req.file is null or undefined, simply proceed to the next middleware
//         next();
//         return;
//       }else{
//       const file = req.file;
//       console.log('File:', file);
//       const originalBucketName = "beens3bucket1";
//       const compressedBucketName = "beens3bucket2";
  
//       if (file.mimetype.startsWith('video/')) {
//         const key = `images/${file.fieldname}_${Date.now()}.mp4`;
//         const uploadParams = {
//             Bucket: originalBucketName,
//             Key: key,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//           };
//           const originalUploadResult = await s3.upload(uploadParams).promise();
//           const originalImagePath = originalUploadResult.Key.replace('images/', '');
    
//           let outputBuffer;
//           let contentType;
      
//         if (file.mimetype.startsWith('video/') && !file.mimetype.endsWith('mp4')) {
//             outputBuffer = await sharp(file.buffer).resize({ height: 720 }).toFormat('mp4').toBuffer();
//             contentType = 'video/mp4';
//           } else {
//             outputBuffer = file.buffer;
//             contentType = file.mimetype;
//           }
//           const compressedKey = `${key}`;
//           const compressedParams = {
//             Bucket: compressedBucketName,
//             Key: compressedKey,
//             Body: outputBuffer,
//             ContentType: contentType,
//           };
//           await s3.upload(compressedParams).promise();
//           req.file.filename=compressedKey.replace('images/', '')
//       } else if (file.mimetype.startsWith('audio/')) {
//         // Audio file, save it directly
//         const key = `images/${file.fieldname}_${Date.now()}.mp3`; // You can choose the appropriate extension
//         const params = {
//           Bucket: originalBucketName,
//           Key: key,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         };
//         await s3.upload(params).promise();
//         req.file.filename = key.replace('images/', '');
//       } else if (file.mimetype===undefined) {
//       next();
//       }
//     } 
//   }catch (error) {
//       next(error);
//     }
//   };
  
//   module.exports = { attachments, compressedattachments };

const AWS = require('aws-sdk');
const sharp = require('sharp');
const { promisify } = require('util');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');


// const s3 = new AWS.S3({
//   accessKeyId: "AKIAWYY5W6WU47T5I63Z",
//   secretAccessKey: "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",
//   region: "us-east-1"
// });
const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});

// Define a Multer storage engine to handle file uploads
const attachments = multer()

const compressedattachments = async (req, res, next) => {
  try {
    if (!req.file) {
      // If req.file is null or undefined, simply proceed to the next middleware
      next();
      return;
    } else {
      const file = req.file;
      console.log('File:', file);
      const originalBucketName = process.env.bucket1;
    const compressedBucketName = process.env.bucket2;

      if (file.mimetype.startsWith('video/')) {
        const key = `images/${file.fieldname}_${Date.now()}.mp4`;
        const uploadParams = {
          Bucket: originalBucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        const originalUploadResult = await s3.upload(uploadParams).promise();
        const originalImagePath = originalUploadResult.Key.replace('images/', '');

        let outputBuffer;
        let contentType;

        if (file.mimetype.startsWith('video/') && !file.mimetype.endsWith('mp4')) {
          outputBuffer = await sharp(file.buffer).resize({ height: 720 }).toFormat('mp4').toBuffer();
          contentType = 'video/mp4';
        } else {
          outputBuffer = file.buffer;
          contentType = file.mimetype;
        }
        const compressedKey = `${key}`;
        const compressedParams = {
          Bucket: compressedBucketName,
          Key: compressedKey,
          Body: outputBuffer,
          ContentType: contentType,
        };
        await s3.upload(compressedParams).promise();
        req.file.filename = compressedKey.replace('images/', '');
      } else if (file.mimetype.startsWith('audio/')) {
        // Audio file, save it directly
        const key = `images/${file.fieldname}_${Date.now()}.mp3`; // You can choose the appropriate extension
        const params = {
          Bucket: compressedBucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        await s3.upload(params).promise();
        req.file.filename = key.replace('images/', '');
      } else if (file.mimetype === undefined) {
        next();
      }
    }
    next(); // Call next to move to the next middleware or route handler
  } catch (error) {
    next(error);
  }
};

module.exports = { attachments, compressedattachments };

