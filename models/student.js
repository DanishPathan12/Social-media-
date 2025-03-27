const mongoose= require("mongoose");

const Schema=mongoose.Schema;

const studentSchema=new Schema({
    name:{type:String,required:true},
    age:{type:Number,required:false},
    email:{type:String,required:true,unique:true},
    phone:{type:String,required:false},
    address:{type:String,required:false},
    photo:{type:String},
    password:{type:String,required:true},
    otp:{type:String},
    isVerified:{type:Boolean,default:false},
    isPremium:{type:Boolean,default:false},

});

module.exports = mongoose.model('Student',studentSchema);