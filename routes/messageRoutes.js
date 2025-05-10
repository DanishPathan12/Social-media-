const express = require("express")
const router = express.Router()
const multer = require("multer");
const authMiddleware = require("../middlewares/authmiddleware");
const storage = require("../utils/storage");
const { sendMessage, recieverMessage } = require("../controllers/message.controller.js")
const upload = multer({ storage });

router.post('/sendMessage', authMiddleware, sendMessage);
router.get('/getMessage', authMiddleware, recieverMessage);

module.exports = router;
