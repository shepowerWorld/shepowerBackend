const AWS = require('aws-sdk');
const sharp = require('sharp');
const { promisify } = require('util');
const multer = require('multer');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const stream = require('stream');

const postUpload = multer();

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});

const convertToMP4 = (inputBuffer) => {
  return new Promise((resolve, reject) => {
    const ffmpegStream = ffmpeg()
      .input(stream.Readable.from(inputBuffer))
      .audioCodec('aac')
      .videoCodec('libx264')
      .format('mp4')
      .on('end', () => console.log('Conversion finished'))
      .on('error', (err) => reject(err))
      .pipe();
    
    const buffers = [];
    ffmpegStream.on('data', (chunk) => buffers.push(chunk));
    ffmpegStream.on('end', () => resolve(Buffer.concat(buffers)));
  });
};

const compressedPostUpload = async (req, res, next) => {
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
          outputBuffer = await sharp(originalFile.buffer).jpeg({ quality: 80 }).toBuffer();
        } else {
          outputBuffer = await sharp(originalFile.buffer).webp({ quality: 80 }).toBuffer();
        }
        contentType = 'image/webp';
      } else if (originalFile.mimetype.startsWith('video/')) {
        if (originalFile.mimetype.endsWith('mp4')) {
          outputBuffer = originalFile.buffer;
          contentType = 'video/mp4';
        } else if (originalFile.mimetype.endsWith('MOV')) {
          outputBuffer = await convertToMP4(originalFile.buffer);
          contentType = 'video/mp4';
        } else {
          outputBuffer = originalFile.buffer;
          contentType = originalFile.mimetype;
        }
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

module.exports = { postUpload, compressedPostUpload };