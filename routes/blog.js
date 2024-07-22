const express=require("express");
const router =express.Router();
const multer =require("multer");
const path =require('path');
const Blog = require("../models/blog");
const Comment = require("../models/comment");


const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve("./public/uploads"));
    },
    filename:function(req,file,cb){
        const fileName =`${Date.now()}-${file.originalname}`;
        cb(null,fileName)
    }

});

const upload =multer({storage:storage})




router.get('/add-new',(req,res)=>{
    return res.render('addblog',{
        user: req.user
    })
})


router.post('/',upload.single("coverImage"),async (req,res)=>{

    const {title,body}=req.body
    const blog= await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.file.filename}`,
    });
    return res.redirect("/")
    })
    

router.get("/:id",async(req,res)=>{
    const blogs =await Blog.findById(req.params.id).populate("createdBy")
    
        return res.render('blog.ejs',{
            user: req.user,
            blog:blogs,
        })
    })


router.post("/comment/:id", async(req,res)=>{
    const comment =await Comment.create({
        content:req.body.content,
        blogId:req.params.id,
        createdBy:req.user._id,
    });
    return res.redirect("/");
})

module.exports=router