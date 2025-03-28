const Comment=require("../models/comment");
const Post=require("../models/post");
const AddComment = async (req,res)=>{
    try {
        const {postId,text}=req.body;
        const userId=req.user._id;

        const newComment=new Comment({
            postId,
            commentedBy:userId,
            text
        })
        await newComment.save();
        res.status(201).json({msg:"Comment added sucessfully"});
        
    } catch (error) {
        res.status(500).json({error:"Error adding Comment"});
    }

}

const GetAllCommentbyPost=async (req,res)=>{
    try {
        const {postId}=req.params;
        const comments= await Comment.find({postId});
        res.json({msg:comments})
    } catch (error) {
        res.status(500).json({msg:"server error"})
    }
}

module.exports={
AddComment,GetAllCommentbyPost
}