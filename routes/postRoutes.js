const express=require("express")
const Post=require("../models/post");
const router =express.Router()
const multer=require("multer");
const authMiddleware = require("../middlewares/authmiddleware");
const storage =require("../utils/storage");



const upload=multer({storage});



router.post('/createPost',authMiddleware,upload.single('photo'),async (req,res)=>{
    try {
        const {title,Des}=req.body;
        const user= req.user._id;
        
        const photopath=req.file ? req.file.path : null;
        const newPost=new Post({
            title,Des,photo:photopath ,
            createdBy:user,

        });
        await newPost.save();
        res.status(201).json({msg:"post is created",post:newPost});
    } catch (error) {
        console.log(error);
        
    }
})


router.get('/getPosts',authMiddleware,async (req,res)=>{
    try {        
        const allPost= await Post.find({})
        res.json(allPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
})



router.get('/getPostbyMe',authMiddleware,async (req,res)=>{
    try {
        const User= req.user._id;
        // just declare user variable from the authmiddleware and req.user[0] ref to _id used it to query it 
        const allPost= await Post.find({createdBy:User})
        res.json(allPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }
})

router.delete('/deletePost/:postId',authMiddleware,async (req,res)=>{
    try {
        const user=req.user._id;
        const {postId}=req.params;
                
        if (!postId) {
            return res.status(400).json({msg:"post ID is required"});
        }
        const deletePost=await Post.findOneAndDelete({_id:postId,createdBy:user});

        if (!deletePost) {
            return res.status(404).json({ message: "Post not found or unauthorized" });
        }
        res.status(200).json({msg:"post deleted "})
    } catch (error) {
        res.status(500);
        console.log(error.message);
        
    }
 
})



module.exports=router;