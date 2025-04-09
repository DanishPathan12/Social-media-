const express=require("express")
const Comment=require("../models/comment");
const Post=require("../models/post");
const router =express.Router()
const authMiddleware=require("../middlewares/authmiddleware");
const { AddComment, GetAllCommentbyPost,  } = require("../controllers/comment.controller");


router.post('/addcomment',authMiddleware,AddComment);
router.get('/getAllCommentbyPost/:postId',authMiddleware,GetAllCommentbyPost);


module.exports = router;