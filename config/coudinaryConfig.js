// Here we configure our cloudinary module using our configuration parameters
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Write a cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
