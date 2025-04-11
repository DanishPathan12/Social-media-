const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../utils/storage");
const { Register, Login, VerifyOtp, updateProfile } = require("../controllers/student.controller.js")
const authMiddleware=require("../middlewares/authmiddleware.js");

const upload = multer({ storage });

router.post("/register", upload.single("photo"), Register);

router.get("/getMyProfile",authMiddleware,getMyProfile);

router.post("/login", Login);


router.post("/verify-otp", VerifyOtp);

router.put("/updateProfile",authMiddleware,upload.single("photo"),updateProfile);


module.exports = router;

