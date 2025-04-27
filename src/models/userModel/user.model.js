const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        maxLength:10,
        minLength:10,
        required:true,
    },
    email:{
        type:String,
        required:true,
        // unique:true
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

userSchema.pre("save",async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
});

userSchema.methods.generateAuthToken=async function(){
    const token = jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:"1hr"
    })
    if(!token){
        throw new Error("token not generated")
    }
    return token;
}

userSchema.statics.authenticateUser=async function(email,password){
    const user = await this.findOne({email});
    if(!user){
        throw new Error("user not found");
    }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("useNaame or password is incorrect");
    }
    return user;
}



const User = mongoose.model('User', userSchema);
module.exports = User;