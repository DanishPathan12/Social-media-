const multer = require("multer");
const cloudinary = require("../utils/cloudinary")
const { CloudinaryStorage } = require("multer-storage-cloudinary");


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", 
        format: async (req, file) => "png", 
        public_id: (req, file) => Date.now() + '-' + file.originalname
    },
});

module.exports=storage;