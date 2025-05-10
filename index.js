const express = require("express")
const app = express()
const port = 3000;
const cors = require("cors");
const { default: mongoose } = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();
app.use(cors());


const mongo = process.env.MONGO
mongoose.connect(mongo, {

}).then(() => {
  console.log('db is connected');

})

const studentRoutes = require("./routes/studentRoutes");
const postRoutes = require("./routes/postRoutes")
const commentRoutes = require("./routes/commentRoutes");
const messageRoutes = require("./routes/messageRoutes.js");
app.use(
  cors({
    origin: process.env.FRONTENDBASEURL,
    credentials: true, // Allow cookies, authentication headers
    methods: "GET,POST,PUT,DELETE", // Allowed request methods
  })
);

// If using cookies for authentication (like JWT in cookies), enable credentials
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});



app.use('/student', studentRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);
app.use('/msg', messageRoutes);

app.listen(port, () => {
  console.log(`our server is live on ${port}`);

})