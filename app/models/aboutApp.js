const mongoose = require("mongoose");

const AboutAppScheema = new mongoose.Schema({
  AppName: {
    type: String,
    required: true,
  },
  AppVersion: {
    type: String,
    required: true,
},
Description: {
    type: String,
    required: true,
  },
 
});

const AboutApp = mongoose.model("AboutApp", AboutAppScheema);

module.exports = AboutApp;
