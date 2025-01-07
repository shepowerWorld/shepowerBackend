const AWS = require('aws-sdk');
const sharp = require('sharp');
const { promisify } = require('util');
const path = require('path')
const multer = require('multer');
const upload = multer()


// Initialize the S3 instance (Make sure to configure AWS SDK with your credentials)
const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});

const originalBucketName = process.env.bucket1;


// const compressAndUploadFiles = async (req, res, next) => {
//   try {
//     const files = req.files; // Assuming 'files' is the key for the uploaded files
//     const fileUploadPromises = [];

//     // Mapping file fields and uploading them to S3
//     const fields = [
//       { field: 'id_card.front', folder: 'id_card/front' },
//       { field: 'id_card.back', folder: 'id_card/back' },
//       { field: 'address_proof.front', folder: 'address_proof/front' },
//       { field: 'address_proof.back', folder: 'address_proof/back' },
//       { field: 'certificate_ngo_or_institute.front', folder: 'certificate_ngo_or_institute/front' },
//       { field: 'certificate_ngo_or_institute.back', folder: 'certificate_ngo_or_institute/back' },
//     ];

//     // Loop through the fields and upload the files
//     fields.forEach(({ field, folder }) => {
//       console.log( "fields",field);
      
//       if (files[field]) {
//         const originalFile = files[field][0]; // Take the first file in the array (since .fields() can handle multiple files)
//         fileUploadPromises.push(
//           uploadFileToS3(originalFile, folder).then((fileUrl) => {
//             req.body[field] = fileUrl; // Add the S3 URL to the request body
//           })
//         );
//       }
//     });

//     // Wait for all upload promises to resolve
//     await Promise.all(fileUploadPromises);

//     // Continue to the next middleware
//     next();
//   } catch (error) {
//     console.error('Error compressing and uploading files:', error);
//     return res.status(500).json({ message: 'Error processing files.', error: error.message });
//   }
// };


// Function to upload file to S3

// const compressAndUploadFiles = async (req, res, next) => {
//   try {
//     const originalBucketName = process.env.bucket1;
//     const compressedBucketName = process.env.bucket2;

//     const fileFields = [
//       'id_card.front',
//       'id_card.back',
//       'address_proof.front',
//       'address_proof.back',
//       'certificate_ngo_or_institute.front',
//       'certificate_ngo_or_institute.back',
//     ];

//     const compressedFiles = {};

//     for (const field of fileFields) {
//       const uploadedFile = req.files?.[field]?.[0]; // Access the first file for each field
//       if (!uploadedFile) continue;

//       // Generate a unique key for the original file
//       const originalKey = `images/${field}_${Date.now()}${path.extname(uploadedFile.originalname)}`;
//       const params = {
//         Bucket: originalBucketName,
//         Key: originalKey,
//         Body: uploadedFile.buffer,
//         ContentType: uploadedFile.mimetype,
//       };

//       // Upload the original file to S3
//       const originalUploadResult = await s3.upload(params).promise();
//       const originalImagePath = originalUploadResult.Key.replace('images/', '');

//       // Compress the file
//       let outputBuffer;
//       let contentType;
//       if (uploadedFile.mimetype === 'image/heic' || uploadedFile.mimetype === 'image/HEIC') {
//         outputBuffer = await sharp(uploadedFile.buffer).jpeg({ quality: 50 }).toBuffer();
//         contentType = 'image/jpeg';
//       } else {
//         outputBuffer = await sharp(uploadedFile.buffer).webp({ quality: 80 }).toBuffer();
//         contentType = 'image/webp';
//       }

//       // Upload the compressed file to S3
//       const compressedKey = `compressed/${field}_${Date.now()}${path.extname(uploadedFile.originalname)}`;
//       const compressedParams = {
//         Bucket: compressedBucketName,
//         Key: compressedKey,
//         Body: outputBuffer,
//         ContentType: contentType,
//       };

//       const compressedUploadResult = await s3.upload(compressedParams).promise();
//       const compressedImagePath = compressedUploadResult.Key.replace('compressed/', '');

//       // Store the paths for later use
//       compressedFiles[field] = {
//         original: originalImagePath,
//         compressed: compressedImagePath,
//       };
//     }


//     console.log("{{{{{{{{{{{{{{{{{", compressedFiles);
    

//     // Attach the compressed files data to the request object
//     req.compressedFiles = compressedFiles;
//     // req.file.filename = compressedFiles.original;
//     next();
//   } catch (error) {
//     console.error("Error during file compression and upload:", error);
//     next(error); // Pass the error to the error handling middleware
//   }
// };

// const compressAndUploadFiles = async (req, res, next) => {
//   try {
//     const files = req.files;  // This will now be a nested object based on the field names.
//     const uploadPromises = [];

//     // Log uploaded files to check the input
//     console.log('Uploaded files:', files);

//     // Loop over the fields in req.files
//     for (const key of Object.keys(files)) {
//       const file = files[key][0];  // Only handling single files for each field
//       const [folder, fileType] = key.split('.');  // Extract folder and fileType from dot notation

//       // Construct S3 folder structure and file key
//       const uploadParams = {
//         Bucket: originalBucketName,
//         Key: `images/${folder}/${fileType}_${Date.now()}_${file.originalname}`, // S3 path
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       };

//       // Upload the file and update req.uploadedFiles with the URL
//       const uploadPromise = s3.upload(uploadParams).promise();
//       uploadPromises.push(
//         uploadPromise.then((data) => {
//           // Log the uploaded file URL for debugging
//           console.log(`${folder} - ${fileType} uploaded:`, data.Location);

//           // Store the file URL in req.uploadedFiles
//           if (!req.uploadedFiles) {
//             req.uploadedFiles = {};
//           }
//           if (!req.uploadedFiles[folder]) {
//             req.uploadedFiles[folder] = {};
//           }
//           req.uploadedFiles[folder][fileType] = data.Location;
//         })
//       );
//     }

//     // Wait for all uploads to finish
//     await Promise.all(uploadPromises);

//     // Log the final req.uploadedFiles to confirm the URLs are correctly added
//     console.log('req.uploadedFiles after S3 upload:', req.uploadedFiles);

//     next(); // Proceed to the next middleware/controller
//   } catch (error) {
//     console.error('Error uploading files to S3:', error);
//     return res.status(500).json({ status: false, message: 'Error uploading files' });
//   }
// };

// const compresssosProfileImg = async (req, res, next) => {
//   try {
//     // Define the bucket names for original and compressed images
//     const originalBucketName = process.env.bucket1;
//     const compressedBucketName = process.env.bucket2;

//     // Initialize an array to store the compressed file keys
//     const compressedFiles = [];

//     // Process each uploaded file
//     for (let key in req.files) {
//       // Iterate through each uploaded file (for each field)
//       const files = req.files[key]; // files for each field

//       for (let file of files) {
//         // Generate a unique key for the original image on S3
//         const originalKey = `images/${key}_${Date.now()}${path.extname(file.originalname)}`;

//         // Upload the original image to S3
//         const params = {
//           Bucket: originalBucketName,
//           Key: originalKey,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         };

//         const originalUploadResult = await s3.upload(params).promise();
//         const originalImagePath = originalUploadResult.Key.replace('images/', '');

//         // Process image for compression (based on MIME type)
//         let outputBuffer;
//         let contentType;

//         // If the image is HEIC, convert it to JPEG, otherwise convert it to WebP
//         if (file.mimetype === 'image/heic' || file.mimetype === 'image/HEIC') {
//           outputBuffer = await sharp(file.buffer).jpeg({ quality: 50 }).toBuffer();
//           contentType = 'image/jpeg';
//         } else {
//           outputBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
//           contentType = 'image/webp';
//         }

//         // Generate a unique key for the compressed image
//         const compressedKey = `${originalKey}`;

//         // Upload the compressed image to S3
//         const compressedParams = {
//           Bucket: compressedBucketName,
//           Key: compressedKey,
//           Body: outputBuffer,
//           ContentType: contentType,
//         };

//         await s3.upload(compressedParams).promise();
//         compressedFiles.push(compressedKey);  // Store the compressed file key
//       }
//     }

//     // Attach the original and compressed file paths to the request object for the next middleware/controller
//     req.compressedFiles = compressedFiles;
//     req.file.filename = originalImagePath;
//     console.log();
    
//     // Move to the next middleware/controller
//     next();
//   } catch (error) {
//     console.error('Error during file compression and upload:', error);
//     next(error); // Pass the error to the next middleware for handling
//   }
// };


const compresssosProfileImg = async (req, res, next) => {
  try {
    // Define the bucket names for original and compressed images
    const originalBucketName = process.env.bucket1;
    const compressedBucketName = process.env.bucket2;

    // Initialize arrays to store the original and compressed file paths
    const compressedFiles = [];
    const originalImagePaths = {};

    // Process each uploaded file
    for (let key in req.files) {
      // Iterate through each uploaded file (for each field)
      const files = req.files[key]; // files for each field
      console.log("{{{{{{{{{{{{{{", files);
      for (let file of files) {
        // Generate a unique key for the original image on S3
        const originalKey = `images/${key}_${Date.now()}${path.extname(file.originalname)}`;

        // Upload the original image to S3
        const params = {
          Bucket: originalBucketName,
          Key: originalKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        
        console.log("s3 start");
        
        const originalUploadResult = await s3.upload(params).promise();
        const originalImagePath = originalUploadResult.Key.replace('images/', '');
        
        console.log("s3end");
        
        // Store the original image path for each field
        originalImagePaths[key] = originalImagePath;

        // Process image for compression (based on MIME type)
        let outputBuffer;
        let contentType;

        // If the image is HEIC, convert it to JPEG, otherwise convert it to WebP
        if (file.mimetype === 'image/heic' || file.mimetype === 'image/HEIC') {
          outputBuffer = await sharp(file.buffer).jpeg({ quality: 50 }).toBuffer();
          contentType = 'image/jpeg';
        } else {
          outputBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
          contentType = 'image/webp';
        }

        // Generate a unique key for the compressed image
        const compressedKey = `${originalKey}`;

        // Upload the compressed image to S3
        const compressedParams = {
          Bucket: compressedBucketName,
          Key: compressedKey,
          Body: outputBuffer,
          ContentType: contentType,
        };

        await s3.upload(compressedParams).promise();
        compressedFiles.push(compressedKey);  // Store the compressed file key
      }
    }
    
    
    console.log("{{{{{{{{{{{{{{", compressedFiles);
    console.log("{{{{{{{{{{{{{{", originalImagePaths);
    // Attach the original image paths and compressed file paths to the request object for the next middleware/controller
    req.originalImagePaths = originalImagePaths;
    req.compressedFiles = compressedFiles;
    console.log("{{{{{{{{{{{{{{ done");
    // Move to the next middleware/controller
    next();
  } catch (error) {
    console.error('Error during file compression and upload:', error);
    next(error); // Pass the error to the next middleware for handling
  }
};



// const uploadFileToS3 = (file, folder) => {
//   return new Promise((resolve, reject) => {
//     const fileKey = `${folder}/${Date.now()}${path.extname(file.originalname)}`;
//     const params = {
//       Bucket: process.env.bucket1, // Original bucket
//       Key: fileKey,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };
    
//     s3.upload(params, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data.Location); // Return the S3 URL of the uploaded file
//       }
//     });
//   });
// };

// Middleware function for compressing and uploading files to S3


// Exporting Multer upload and compress function
module.exports = { upload, compresssosProfileImg };
