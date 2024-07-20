const express =require("express");
const mongoose =require("mongoose");
const path =require("path");
const app =express();
const userRoute =require('./routes/user')

const PORT =8000;


//mongodb

mongoose.connect('mongodb://localhost:27017/blog-app')
.then((e) => console.log("mongodb connected"))
.catch(console.log("problem in connecting mongodb"))
//setting the frontend part
app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"));

//middleware
app.use(express.urlencoded({extended:false}));

//routes
app.get('/',(req,res)=>{
    res.render("home.ejs")
})

app.use('/user',userRoute);

app.listen(PORT,() => console.log(`Server Started at PORT :${PORT}`));

