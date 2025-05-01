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
const getUser = expressAsyncHandler(async(req,res)=>{
    const user = await User.find({name:req.params.id});
    console.log("finding"+ req.params.id);
    res.json(user);
})

    const followOrUnfollow = expressAsyncHandler(async (req, res) => {
    const { follower, followee } = req.body;
  
    try {
      const followerUser = await User.findOne({ name: follower });
      const followeeUser = await User.findOne({ name: followee });
  
      if (!followerUser || !followeeUser) {
        return res.status(404).json({ error: "User(s) not found" });
      }
  
      const isFollowing = followeeUser.followers.includes(follower);
  
      if (isFollowing) {
        // Unfollow
        followeeUser.followers = followeeUser.followers.filter(name => name !== follower);
        followerUser.following = followerUser.following.filter(name => name !== followee);
      } else {
        // Follow
        followeeUser.followers.push(follower);
        followerUser.following.push(followee);
      }
  
      await followeeUser.save();
      await followerUser.save();
  
      res.json({ message: isFollowing ? "Unfollowed" : "Followed", updatedUser: followeeUser });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  


const getUsers = expressAsyncHandler(async(req,res)=>{
    const users =await User.find({});
    console.log(users);
    res.json(users);
})
const postLogin = expressAsyncHandler(async (req, res) => {
    let { userEmail, password } = req.body;
    try {
      if (!userEmail || !password) {
        throw new Error("Fill the fields");
      }
  
      const expectedUser = await User.findOne({ email: userEmail }).lean();
  
      if (!expectedUser) {
        throw new Error("No user detected");
      }
  
      const result = await bcrypt.compare(password, expectedUser.password);
      if (!result) {
        throw new Error("Wrong password");
      }
  
      const token = jwt.sign(expectedUser, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
  
      // ✅ Return token in response instead of setting a cookie
      res.json({
        message: `Welcome ${expectedUser.name}`,
        isLogged: true,
        token, // send token in JSON
      });
  
    } catch (e) {
      res.json({ message: e.message, isLogged: false });
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

export default {home,postLogin,getSignup,getLogin,postSignup,getUsers,getUser,followOrUnfollow};