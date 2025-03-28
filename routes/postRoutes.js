const express = require("express")
const router = express.Router()
const multer = require("multer");
const authMiddleware = require("../middlewares/authmiddleware");
const storage = require("../utils/storage");
const { CreatePost, GetPostbyMe, DeletePost,GetPost } = require("../controllers/post.controller.js")


const upload = multer({ storage });


router.post('/createPost', authMiddleware, upload.single('photo'), CreatePost);

router.get('/getPosts', authMiddleware, GetPost);

router.get('/getPostbyMe', authMiddleware, GetPostbyMe);

router.delete('/deletePost/:postId', authMiddleware, DeletePost);


module.exports = router;