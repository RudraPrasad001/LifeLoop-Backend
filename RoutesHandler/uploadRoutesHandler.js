import Post from "../schemas/post.js";
import expressAsyncHandler from "express-async-handler";

const getPosts = expressAsyncHandler(async (req,res)=>{
    const posts = await Post.find({});
    res.json(posts);
}
);

const getPost = expressAsyncHandler(async(req,res)=>{
    const post = await Post.find({_id:req.params.id});
    if(!post){
        return res.json({message:"Post Not found"});
    }
    return res.json(post);
})

const getCommentLike = expressAsyncHandler(async(req,res)=>{
    
    const { post, comment, user } = req.body;
    const postId = post._id;  
    const foundPost = await Post.findById(postId);
    if (!foundPost) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment in the post
    const trueComment = foundPost.comments.find(c => c.text === comment.text);
    if (!trueComment) {
        return res.status(404).json({ message: "Comment not found" });
    }
    res.json({likes:trueComment.likes.length});
})

const increaseCommentLike = expressAsyncHandler(async (req, res) => {
    const { post, comment, user } = req.body;  // Assuming post is passed as the full object

    // If you already have the post object, you can directly access the _id field
    const postId = post._id;  // This is the unique identifier for the post

    // Find the post by its ID
    const foundPost = await Post.findById(postId);
    if (!foundPost) {
        return res.status(404).json({ message: "Post not found" });
    }

    // Find the comment in the post
    const trueComment = foundPost.comments.find(c => c.text === comment.text);
    if (!trueComment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has already liked the comment
    if (trueComment.likes.includes(user)) {
        // Remove the like
        trueComment.likes = trueComment.likes.filter(u => u !== user);
        console.log("REMOVED LIKE")
    } else {
        // Add the like
        trueComment.likes = [...trueComment.likes, user];
        console.log("LIKED")
    }

    // Save the updated post to the database
    await foundPost.save();

    // Return the updated comment
    res.json({likes:trueComment.likes.length});
});





const updatePostLikes = expressAsyncHandler(async(req,res)=>{
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
    });

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
export default {getPosts,updatePostLikes,postComment,increaseCommentLike,getCommentLike,getPost};