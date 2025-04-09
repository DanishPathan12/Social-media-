
const Post = require("../models/post");


const CreatePost = async (req, res) => {
    try {
        const { title, Des } = req.body;
        const user = req.user.username;

        const photopath = req.file ? req.file.path : null;
        const newPost = new Post({
            title, Des, photo: photopath,
            createdBy: user,

        });
        await newPost.save();
        res.status(201).json({ msg: "post is created", post: newPost });
    } catch (error) {
        console.log(error);

    }
}

const GetPost = async (req, res) => {
    try {
        const allPost = await Post.find({})
        res.json(allPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

const GetPostbyMe = async (req, res) => {
    try {
        const User = req.user.username;
        // just declare user variable from the authmiddleware and req.user[0] ref to _id used it to query it 
        
        const allPost = await Post.find({ createdBy: User })
        res.json(allPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

const DeletePost = async (req, res) => {
    try {
        const user = req.user.username;
        const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({ msg: "post ID is required" });
        }
        const deletePost = await Post.findOneAndDelete({ _id: postId, createdBy: user });
        
        if (!deletePost) {
            return res.status(404).json({ message: "Post not found or unauthorized" });
        }
        res.status(200).json({ msg: "post deleted " })
    } catch (error) {
        res.status(500);
        console.log(error.message);

    }

}


const updatePost=async (req,res) => {
    try {
        const user = req.user.username;
        const { postId } = req.params;
        const {title,Des}=req.body;
        const photoPath = req.file?.path || null;
        
        if (!postId) {
            return res.status(400).json({ msg: "post ID is required" });
        }
        const updatePost=await Post.findOneAndUpdate(
            {   _id:postId,
                createdBy:user,
            },{
                title,
                Des,
                photoPost:photoPath,
            },
            {
                new:true,runValidators:true
            }
        )
        res.status(200).json({msg:updatePost});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"internal server error"})
        
    }
}

const addlike = async (req, res) => {
    try {
        const { postId } = req.body;
        const username = req.user.username;
        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        if (post.likedBy.includes(username)) {
            return res.status(400).json({ msg: "You have already liked this post" });
        }

        const addLike = await Post.findOneAndUpdate(
            { _id: postId },
            {
                $inc: { likes: 1 },
                $push: { likedBy: username },
            },
            { new: true }
        );

        res.status(200).json({ msg: "Post liked successfully", post: addLike });
    } catch (error) {
        res.status(500).json({ msg: "Something went wrong" });
        console.log(error);
    }
};






module.exports = { CreatePost, GetPost, GetPostbyMe, DeletePost,updatePost,addlike};