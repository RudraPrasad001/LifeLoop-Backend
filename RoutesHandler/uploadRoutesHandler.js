import Post from "../schemas/post.js";
import expressAsyncHandler from "express-async-handler";

const getPosts = expressAsyncHandler(async (req,res)=>{
    const posts = await Post.find({});
    res.json(posts);
}
);



const updateLikes = expressAsyncHandler(async(req,res)=>{
    const {caption,user}=req.body;
    const findPost = await Post.findOne({caption:caption});
    let updatedLikes;
    if(findPost.likes.includes(user)){
        
    console.log("tried to remove like");
         const newLikes = findPost.likes.filter(u => u !== user);
         updatedLikes = newLikes;
         await Post.updateOne({caption:caption},{
        $set:{
            likes:newLikes
        }});
    console.log(newLikes)

    }
    else{
        const newLikes = [...findPost.likes,user];
        
    console.log("tried to like");
        console.log(newLikes);
        
        updatedLikes = newLikes;
        await Post.updateOne({caption:caption},{
            $set:{
                likes:newLikes,
            }});
            
    }
    
    res.json({ likes: updatedLikes }); 
    })

;

const postComment = expressAsyncHandler(async(req,res)=>{
    
    const {comment,caption,user}=req.body;
    const findPost = await Post.findOne({caption:caption});
    console.log("old comments");
    console.log(findPost.comments);
    const newCommentBox = {userId:user,text:comment};
    const newComments = [...findPost.comments,newCommentBox];
    const ress = await Post.updateOne({caption:caption},{
        $set:{
            comments:newComments,
        }
    })
    console.log("Comments updated succesfully")
    res.json({comments:newComments});
})
export default {getPosts,updateLikes,postComment};