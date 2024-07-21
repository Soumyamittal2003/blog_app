const { Schema,model, Error } =require ("mongoose");
const {createHmac,randomBytes} =require("node:crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema =new Schema(
    {
        fullName:{
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

    const salt =randomBytes(16).toString();
    const hashedPassword =createHmac("sha256",salt)
    .update(user.password)
    .digest("hex");

    this.salt =salt;
    this.password=hashedPassword;

    next();


})

//creating the virtual function matching the password which return true or false;
userSchema.static('matchPasswordAndGenerateToken', async function(email,password){
    const user =await this.findOne({email});
    if(!user) throw new Error('User not found');

    const salt =user.salt;
    const hashedPassword =user.password;

    const userProvidedHash =createHmac("sha256",salt)
    .update(password)
    .digest("hex");

    if(hashedPassword !== userProvidedHash) throw new Error('Incorrect password')

    const token =createTokenForUser(user);
    return token;
})


const User =model("user",userSchema);

module.exports=User;