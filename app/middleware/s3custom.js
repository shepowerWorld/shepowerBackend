const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require("fs");
const path = require("path");



const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Uploads folder created');
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('--+++++++++++++', cb)
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        console.log("File information :: ", file);
        console.log('--+++++++++++++------')
        var name = file.originalname;
        var extension = path.extname(name);
        cb(null, name + '-' + Date.now() + extension);
    }
});



var upload = multer({ storage: storage });

AWS.config.setPromisesDependency();


const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});

console.log('uploadFileToBucket')

const uploadFileToBucket = async function (req, res, uploadPath) {

    console.log(req.file);

    // const absolutePath = path.resolve(req.file.path);
    // console.log( absolutePath , "absolutepath");
    
    
    const fileContent = req.file.buffer;
    console.log(fileContent);
    
    const extension = path.extname(req.file.originalname);
    console.log('extension' , extension)
    
    const fullFilepath = uploadPath + getRandomFileName() + extension;

    console.log("fullFilepath",fullFilepath);
    
    const params = {
        Bucket: process.env.bucket1,
        ACL: 'public-read',
        Body: fileContent,
        Key: fullFilepath,
        ContentType: req.file.mimetype
    };

    console.log("params{{{{{{}}}}}}}{{{{{{{{{{",params);
    



    s3.upload(params, (err, data) => {
        console.log(data);
        if (err) {
            console.log("error--------------------------------- : " + err);

            let errorMessage = "Failed while uploading images";
            return res.status(500).json({
                success: false,
                message: errorMessage || 'Failed while uploading images',
                error_code: 'INTERNAL_SERVER_ERROR'
            });
        } else {
            console.log("else");
            if (data) {
                const locationUrl = data.Location;
                console.log("------ext lower-----", extension);
                if (extension == ".jpeg" || extension == ".jpg" || extension == ".png" || extension == ".gif" || extension == ".tiff") {

                    return res.status(200).json({
                        success: true,
                        message: "Image added successfully",
                        path: locationUrl
                    });
                } else {
                    if (extension == ".pdf") {
                        return res.status(200).json({
                            success: true,
                            message: "File added successfully",
                            path: locationUrl
                        });
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: "Video added successfully",
                            path: locationUrl
                        });

                    }
                }

            }
        }
    });
}


function getRandomFileName() {
    var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    var random = ("" + Math.random()).substring(2, 8);
    var randomNumber = timestamp + random;
    return randomNumber;
}

module.exports = {
    uploadFileToBucket,
    upload
}
