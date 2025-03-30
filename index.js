const express =require("express")
const app=express()
const port=3000;
const cors=require("cors");
const { default: mongoose } = require("mongoose");
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

require('dotenv').config();
app.use(cors());


const mongo='mongodb://localhost:27017/multer-db'
mongoose.connect(mongo,{
    
}).then(()=>{
    console.log('db is connected');
    
})

const studentRoutes=require("./routes/studentRoutes");
const postRoutes=require("./routes/postRoutes")
const commentRoutes=require("./routes/commentRoutes");

app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true, // Allow cookies, authentication headers
      methods: "GET,POST,PUT,DELETE", // Allowed request methods
    })
  );
  
  // If using cookies for authentication (like JWT in cookies), enable credentials
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });
  


app.use('/student',studentRoutes);
app.use('/posts',postRoutes);
app.use('/comment',commentRoutes);


app.listen(port,()=>{
    console.log(`our server is live on ${port}`);
    
})