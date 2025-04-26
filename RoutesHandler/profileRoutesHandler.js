import expressAsyncHandler from "express-async-handler";
import Post from "../schemas/post.js";
const getProfilePosts = expressAsyncHandler(async(req,res)=>{
    const user = req.params.id;
    const posts = await Post.find({userId:user});
    
    console.log(posts);
    res.json(posts);
}
);
export default {getProfilePosts};