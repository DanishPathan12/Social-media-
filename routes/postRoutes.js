const express = require("express")
const router = express.Router()
const multer = require("multer");
const authMiddleware = require("../middlewares/authmiddleware");
const storage = require("../utils/storage");
const { CreatePost, GetPostbyMe, DeletePost,GetPost, updatePost } = require("../controllers/post.controller.js")


const upload = multer({ storage });


router.post('/createPost', authMiddleware, upload.single('photo'), CreatePost);

router.get('/getPosts', authMiddleware, GetPost);

router.get('/getPostbyMe', authMiddleware, GetPostbyMe);

router.delete('/deletePost/:postId', authMiddleware, DeletePost);

router.put('/updatePost/:postId',authMiddleware,upload.single('photoPost'),updatePost);

module.exports = router;