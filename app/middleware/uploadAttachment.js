// const AWS = require('aws-sdk');
// const sharp = require('sharp');
// const { promisify } = require('util');
// const multer = require('multer');
// const path = require('path')
// const ffmpeg = require('fluent-ffmpeg');
// const attachment= multer()


// const s3 = new AWS.S3({
//   accessKeyId: process.env.accessKeyId,
//   secretAccessKey: process.env.secretAccessKey,
//   region: process.env.region
// });

// // const s3 = new AWS.S3({
// //   accessKeyId: "AKIAWYY5W6WU47T5I63Z",
// // secretAccessKey:"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",
// //   region: "us-east-1"
// // });


// // const compressedattachment = async (req, res, next) => {
// //     try {
// //       const originalBucketName = process.env.bucket1;
// //       const compressedBucketName = process.env.bucket2;
// //       const originalFiles = req.files;
// //       const compressedFiles = [];
  
// //       for (const originalFile of originalFiles) {
// //         const originalKey = `images/${originalFile.fieldname}_${Date.now()}${path.extname(originalFile.originalname)}`;
  
// //         const uploadParams = {
// //           Bucket: originalBucketName,
// //           Key: originalKey,
// //           Body: originalFile.buffer,
// //           ContentType: originalFile.mimetype,
// //         };
// //         const originalUploadResult = await s3.upload(uploadParams).promise();
// //         const originalImagePath = originalUploadResult.Key.replace('images/', '');
  
// //         let outputBuffer;
// //         let contentType;
  
// //         if (originalFile.mimetype.startsWith('image/')) {
// //           if (originalFile.mimetype === 'image/heic' || originalFile.mimetype === 'image/HEIC') {
// //             outputBuffer = await sharp(originalFile.buffer).jpeg({ quality: 40 }).toBuffer();
// //           } else {
// //             outputBuffer = await sharp(originalFile.buffer).webp({ quality: 40 }).toBuffer();
// //           }
// //           contentType = 'image/webp';
// //         } else if (originalFile.mimetype.startsWith('video/')) {
// //             if (originalFile.mimetype.startsWith('video/') && !originalFile.mimetype.endsWith('mp4')) {
// //                 outputBuffer = await sharp(originalFile.buffer).resize({ height: 720 }).toFormat('mp4').toBuffer();
// //                 contentType = 'video/mp4';
// //               } else {
// //                 outputBuffer = originalFile.buffer;
// //                 contentType = originalFile.mimetype;
// //               }
// //         }
  
// //         const compressedKey = `${originalKey}`;
// //         const compressedParams = {
// //           Bucket: compressedBucketName,
// //           Key: compressedKey,
// //           Body: outputBuffer,
// //           ContentType: contentType,
// //         };
// //         await s3.upload(compressedParams).promise();
// //         compressedFiles.push(compressedKey.replace('images/', ''));
// //       }
  
// //       req.compressedFiles = compressedFiles;
// //       req.files.forEach((file, index) => (file.filename = compressedFiles[index]));
// //       next();
// //     } catch (error) {
// //       next(error);
// //     }
// //   };
  


// module.exports = {attachment,compressedattachment};


const AWS = require('aws-sdk');
const sharp = require('sharp');
const { promisify } = require('util');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const attachment = multer();

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});

const compressedattachment = async (req, res, next) => {
  try {
    const originalBucketName = process.env.bucket1;
    const compressedBucketName = process.env.bucket2;
    const originalFiles = req.files;
    const compressedFiles = [];

    for (const originalFile of originalFiles) {
      const originalKey = `images/${originalFile.fieldname}_${Date.now()}${path.extname(originalFile.originalname)}`;

      const uploadParams = {
        Bucket: originalBucketName,
        Key: originalKey,
        Body: originalFile.buffer,
        ContentType: originalFile.mimetype,
      };
      const originalUploadResult = await s3.upload(uploadParams).promise();
      const originalImagePath = originalUploadResult.Key.replace('images/', '');

      let outputBuffer;
      let contentType;

      if (originalFile.mimetype.startsWith('image/')) {
        if (originalFile.mimetype === 'image/heic' || originalFile.mimetype === 'image/HEIC') {
          outputBuffer = await sharp(originalFile.buffer).jpeg({ quality: 40 }).toBuffer();
        } else {
          outputBuffer = await sharp(originalFile.buffer).webp({ quality: 40 }).toBuffer();
        }
        contentType = 'image/webp';
      } else if (originalFile.mimetype.startsWith('video/')) {
        if (originalFile.mimetype.startsWith('video/') && !originalFile.mimetype.endsWith('mp4')) {
          outputBuffer = await sharp(originalFile.buffer).resize({ height: 720 }).toFormat('mp4').toBuffer();
          contentType = 'video/mp4';
        } else {
          outputBuffer = originalFile.buffer;
          contentType = originalFile.mimetype;
        }
      } else if (originalFile.mimetype.startsWith('application/pdf')) {
        // Handle PDF files
        // You can add your PDF processing logic here if needed
        outputBuffer = originalFile.buffer;
        contentType = originalFile.mimetype;
      }

      const compressedKey = `${originalKey}`;
      const compressedParams = {
        Bucket: compressedBucketName,
        Key: compressedKey,
        Body: outputBuffer,
        ContentType: contentType,
      };
      await s3.upload(compressedParams).promise();
      compressedFiles.push(compressedKey.replace('images/', ''));
    }

    req.compressedFiles = compressedFiles;
    req.files.forEach((file, index) => (file.filename = compressedFiles[index]));
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { attachment, compressedattachment };



 
 
