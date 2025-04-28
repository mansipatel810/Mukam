const userModel=require('../../models/userModel/user.model');
const customError = require('../../utils/customError');
const cacheClient = require('../../services/cache.services');
const logger = require('../../utils/logger');



const userRegister= async (req,res,next)=>{
    const {userName,mobile,email,address,password}=req.body;

   try {
    if(!userName || !mobile || !email || !address || !password){
        return res.send("please provide all fields")
    }

    const existingUser = await userModel.findOne({email});
    if(existingUser){
        return next(new customError("user already exists",400))
    }

    const newUser = await userModel.create({
        userName,
        mobile,
        email,
        address,
        password
    })

    const token = await newUser.generateAuthToken();
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"none"
    })


    return res.status(201).json({
        status: true,
        message: "user created successfully",
        data: newUser
    })
   } catch (error) {
      next(new customError(error.message,400))
   }
}

const userLogin=async (req,res,next)=>{
    const {email,password}=req.body;
    
    try {
        if(!email || !password){
            return res.send("please provide email and password")
        }
    
        const user = await userModel.authenticateUser(email,password);
    
        const token = await user.generateAuthToken();
        res.cookie("token",token,{
            httpOnly:true,
            sameSite:"none"
        }) 

        logger.info(`user logged in successfully with email: ${email}`)
    
        return res.status(200).json({
            status:true,
            message:"user logged in successfully",
            data:user
        })
    } catch (error) {
        logger.error(`user login failed with email: ${email} and error: ${error.message}`)
        next(new customError(error.message,400))
    }

}

const userLogout=async (req,res,next)=>{

    const token= req.cookies.token;

    try {
        if(!token) return next(new customError("user not logged in",400))

        const blackListToken=await cacheClient.set(
            token,
            "blacklisted",
            "EX",
            3600 //(ye 1hr isliye kyunki token apne aap 1 hr ke baad expire ho jayegi humne login ke time 1hr expiration time diya hai)
        ) 

        res.clearCookie("token");
        res.status(200).json({
            status:true,
            message:"user logged out successfully"
        })
    } catch (error) {
        return next(new customError(error.message,400));
    }

}

const currentUser = async (req,res,next)=>{
    try {
        const user = req.user;
        res.status(200).json({
            status:true,
            message:"user found successfully",
            data:user
        })
    } catch (error) {
        return next(new customError(error.message,400));
    }
}

module.exports={
    userRegister,
    userLogin,
    userLogout,
    currentUser
}