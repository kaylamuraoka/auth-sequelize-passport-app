// In the code below, is the configuration used for uploading images to our cloudinary storage
// import multer and nodejs core module path
const multer = require("multer");
const path = require("path");

// Multer configuration
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: function (req, file, cb) {
    // Extract file extension in order to filter files we want to allow.
    // We only allow images to pass
    let ext = path.extname(file.originalname);

    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
