import express from "express";
import mongoose from "mongoose";
const app = express();
const PORT = 5000;
import "./models/user.js";//Loading a module

import authRouter from "./routes/auth.js";

//UserName: ayushWho // Password=NvseaJSR2ynjdGIT
mongoose.connect("mongodb+srv://ayushWho:NvseaJSR2ynjdGIT@auth.aveziaq.mongodb.net/")   //connect function connects us to database
mongoose.connection.on("connected", ()=>{console.log("Connected to database")})         //use to check if connection process 
mongoose.connection.on("error", ()=>{console.log("error Connecting to database")})      //was succefull or errored.

//Midleware
app.use(express.json());
app.use("/api/auth",authRouter);

app.get('/', (req,res)=>{
    res.send("This is working well....")
})

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}.....`)
})