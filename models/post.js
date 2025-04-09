const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true },
    Des: { type: String, required: true },
    createdBy: {
        type: String,
        ref: 'Student',
        required: true
    },
    photoPost: { type: String },
    commentBox: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String, ref: "Student" }],

}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);