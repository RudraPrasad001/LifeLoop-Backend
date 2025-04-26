import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from '../schemas/user.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const home = (req,res)=>{
    return res.redirect(`${process.env.URL}/`);
}
const getLogin = (req,res)=>{
    
    return res.redirect(`${process.env.URL}/login`);
};
const getUsers = expressAsyncHandler(async(req,res)=>{
    const users =await User.find({});
    console.log(users);
    res.json(users);
})
const postLogin = expressAsyncHandler(async(req,res)=>{
    let {userEmail,password} = req.body;
    try{
        if(userEmail.length===0 || password.length===0){
            throw new Error("Fill the fields");
        }
        const expectedUser =await User.findOne({email:userEmail}).lean();
        if(expectedUser){
            let result = await bcrypt.compare(password,expectedUser.password);
            if(result==true){
                const expectedUserObj = expectedUser;
                console.log(expectedUserObj);
                const token = jwt.sign(expectedUserObj,process.env.SECRET_KEY,{expiresIn:'1h'});
                console.log(token);
                res.cookie("token",token,{
                    httpOnly:false,
                    secure: true,
                    sameSite: "none",
                    maxAge: 24 * 60 * 60 * 1000,
                });
                res.json({message:`Welcome ${expectedUser.name}`,isLogged:true});
            }
            else{
                throw new Error("wrong password");
            }
        }
        else{
            throw new Error("No user detected");
        }
    }
    catch(e){
        res.json({message:  e.message,isLogged:false});
    }
});

const getSignup = expressAsyncHandler((async (req,res)=>{
    
    return res.redirect(`${process.env.URL}/signup`);
}));
const postSignup = expressAsyncHandler(async(req,res)=>{
    const {name,userEmail,password} = req.body;
    try{
    if(name.length===0|| userEmail.length===0 || password.length===0){
        throw new Error("Fill all the fields");
    }
    else{
        let existedUserMail = await User.findOne({email:userEmail});
        let existedUserName = await User.findOne({name:name});
        if(existedUserMail){
            throw new Error("Email Already Registered");
        }
        if(existedUserName){
            throw new Error("UserName Already Exists");
        }
        else{
            let hashedPassword = await bcrypt.hash(password,12);
            let newUser = await User.create({name:name,email:userEmail,password:hashedPassword});
            res.json({message:"New user successfully created"});
        }
    }}
    catch(e){
        res.json({message:  e.message});
    }

    res.json({message:'post signup page'});
});

export default {home,postLogin,getSignup,getLogin,postSignup,getUsers};