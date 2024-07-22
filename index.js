const express =require("express");
const mongoose =require("mongoose");
const path =require("path");
const app =express();
const cookieParser =require("cookie-parser");

const Blog =require("./models/blog")


const userRoute =require('./routes/user')
const blogRoute =require('./routes/blog')

const { checkForAuthenticationCookie } = require("./middleware/authentication");


const PORT =8000;


//mongodb

mongoose.connect('mongodb://localhost:27017/blog-app')
.then(() => console.log("mongodb connected",))
.catch((err)=> console.log("problem in connecting mongodb",err));



//setting the frontend part
app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"));

//middleware
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))


//routes
app.get('/',async(req,res)=>{

    const allBlogs =await Blog.find({})
    res.render("home.ejs",{
        user:req.user,
        blog:allBlogs,
    })
})

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(PORT,() => console.log(`Server Started at PORT :${PORT}`));

