import express from 'express';
import mongoose from 'mongoose';
const authRouter = express.Router();
const user =  mongoose.model("User");
import {v4 as uuid4} from 'uuid';
// uuid is alias of v4 i.e: everytime uuid4 is called it will meant v4
// as: alias. Note: for common.js use {v4: uuid} = require('uuid')
import bcrypt from 'bcrypt';
import isLoggedIn from '../middleweare/isLoggedIn.js';


//SIGN UP
authRouter.post('/signup', (req,res)=>{
    console.log(req.body)
    //    console.log(req.body)
    //    res.send("Data received")
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        res.send("Enter all the details pls.....")
    }

    user.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
           return res.send({error: "user already exists"})
        }
    
        // password hashing: 
        //bcrypt.hash(password, saltround)
        //salt round is a number that determin how many encryption layer will
        //be made ie: pass: abc->cda->dea->123(if saltround = 4)
        bcrypt.hash(password, 12)
        .then((hashedPassword)=>{
            if(!hashedPassword){
                return res.send({error: "user could not be created"})
            }
            // creating a new user object for User Model
                let newUser = new user({
                name: name,
                email: email,
                password: hashedPassword
            })

            newUser.save()  // async in nature
            .then((savedUser)=>{
                if(!savedUser){
                    return res.send({error: "user could not be created"})
                }
                return res.send({success: true, message: "User saved successfully", data: savedUser})
            })
            .catch(err => console.log(err))

        })

        .catch(err=>console.log("Issue while saving user to database"))
    })
    .catch(err=>console.log("Issue with searching user email in database"))


})

//LOGIN

authRouter.post("/login",(req, res)=>{
    console.log(req.body)
    let {email, password} = req.body

    if(!email || !password){
        return res.send("Please enter email and password both...")
    }

    user.findOne({email:email})
        .then((foundUser)=>{
            console.log("founduser: ",foundUser)
            if(!foundUser){
                console.log("User does'nt exits...")
            }

            bcrypt.compare(password, foundUser.password)
                .then((result)=>{
                        if(result==false){
                            return res.send({error: "Invalid password"})
                     }
                     let token = uuid4();
                     foundUser.token=token;
                     foundUser.save()
                     .then((savedUser)=>{
                        return res.send({success: true, message: "User logged in successfully", data: savedUser})
                    })
                    .catch(err=>console.log("Error in saving a token"))
                })
                
        })
        .catch(err=>console.log("Error in finding the email"))
})

authRouter.get("/secret1", isLoggedIn,(req,res)=>{
    return res.send({success:true, message: "You are authorised to be a raw Agent", isLoggedInUserDetail : req.user})
})


authRouter.delete("/logout",isLoggedIn, async (req, res)=>{
    req.user.token = null;
    try{
        let savedUser= await req.user.save()
        if(savedUser){
            return res.send({success:true, message: "Logged out succefully", data : req.user})
        }
    }
    catch(err){
        console.log("User can't be logged out: ",err);
    }
})

export default authRouter;




