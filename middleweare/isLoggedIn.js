import  Express  from "express";
import mongoose from "mongoose";
const user =  mongoose.model("User");

const isLoggedIn = async (req, res, next)=>{
    let token = req.headers.authorization
    console.log("token = ",token)

    token = token.split(" ")[1]
    // to extract the token out of string that also contains Bearer
    try{
        let foundUser= await user.findOne({token:token})
        if(!foundUser){
            return res.send({ error:"User not found..."})
        }
        req.user=foundUser
        next()//this stops function here since our try block's motive is over.
    }
    catch(err){
        console.log("Token is invalid: ",err)
    }

}


export default isLoggedIn;