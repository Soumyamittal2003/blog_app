const express =require("express");
const path =require("path");
const app =express();
const userRoute =require('./routes/user')

const PORT =8000;

//setting the frontend part
app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"));


//routes
app.get('/',(req,res)=>{
    res.render("home.ejs")
})

app.use('/user',userRoute);

app.listen(PORT,() => console.log(`Server Started at PORT :${PORT}`));

