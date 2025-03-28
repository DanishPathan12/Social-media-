const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = require("../utils/storage");
const { Register, Login, VerifyOtp } = require("../controllers/student.controller.js")

const upload = multer({ storage });

router.post("/register", upload.single("photo"), Register);


router.post("/login", Login);


router.post("/verify-otp", VerifyOtp);


module.exports = router;

