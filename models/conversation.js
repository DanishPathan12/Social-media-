const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const conversationSchema=new Schema({
    sender:{
        type:String,
        ref:"Student",
        required:true,
    },
    reciever:{
        type:String,
        ref:"Student",
        required:true,
    },
    message:{
        type:String,
        required:true,
    }
},{
    timestamps:true,
});

module.exports=mongoose.model('Conversation',conversationSchema);