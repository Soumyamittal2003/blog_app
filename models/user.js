const { Schema,model } =require ("mongoose");
const {createHmac} =require("crypto");

const userSchema =new Schema(
    {
        fullname:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        salt:{
            type:String,
            
        },
        password:{
            type:String,
            required:true,
        },
        profileImageURL:{
            type:String,
            default:"public/images/user_profile.jpg",
        },
        role:{
            type:String,
            enum:["USER","ADMIN"],
            default:"USER",
        }
    },{timestamps:true}
);

//we are trying to create a hashed password for every user, for that we use some steps:
 
//1. using the pre model function to load the function before the user is created from model.
//2. we use the inbuilt crypto npm pakage to genrate the hashed value, & and for the secret key , we generarate a randon 16bit key for every user(SALT).And from that key we hashed the password.

userSchema.pre("save",function(next){
    const user =this;
    if(!user.isModified("password")){return;} //if there is no change in password then we will not execute the function.

    const salt =randonBytes(16).toString();
    const hashedPassword =createHmac("sha256",salt)
    .update(user.password)
    .digest("hex");

    this.salt =salt;
    this.password=hashedPassword;

    next();


})


const User =model("user",userSchema);

module.exports=User;