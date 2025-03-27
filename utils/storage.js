const multer=require("multer")

 const storage =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        const suffix=Date.now();
        cb(null,suffix + '-' + file.originalname);
    }
})

module.exports=storage;