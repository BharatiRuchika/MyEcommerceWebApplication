//check if user is authenticated or not
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
exports.isAuthenticatedUser =async(req,res,next)=>{
    // const token = req.cookies.token;
    const token = req.header("Authorization");
    console.log("cookie",req.cookie);
    // console.log("token",token);
    console.log("headers",req.header);
    console.log("headers",req.header("Authorization"));
    if(!token){
       console.log("im in token unfefines");
       return next(new ErrorHandler('You have to login first to access this resource', 401));
    }
    console.log("secret",process.env.JWT_SECRET);
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    console.log("id",decoded.id);
    req.user = await User.findById(decoded.id);
    console.log("user",req.user);
    next();
}
//handling users roles
exports.authorizeRoles = (...roles)=>{
    try{
    console.log("im here");
   
   return (req,res,next)=>{
    console.log("user",req.user);
    console.log("roles",roles);
       if(!roles.includes(req.user.role)){
           console.log(req.user.role);
           return res.send({msg:`${req.user.role} is not allowed to access this route`})
       }
       next();
   }
}catch(err){
    res.send(err);
}
}