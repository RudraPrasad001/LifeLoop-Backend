import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import Post from "../schemas/post.js";
import getters from "../RoutesHandler/uploadRoutesHandler.js";

dotenv.config();
const cloudRouter = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudRouter.post("/",upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ folder: "uploads" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(req.file.buffer);
    });

    res.status(200).send({
      message: "File uploaded successfully",
      url: result.secure_url,
    });
    const {userId,caption,tag} = req.body;
    console.log(`user id is ${userId} and the caption is ${caption}` )
    const post = await Post.create({userId:userId,caption:caption,imageUrl:result.secure_url,tags:tag});

    if(post){
      console.log(`Post created by ${userId} successfully`);
    }

    console.log(result.secure_url);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).send({ message: "Error uploading to Cloudinary" });
  }
});

cloudRouter.get("/posts",getters.getPosts);
cloudRouter.put("/updateLikes",getters.updateLikes);

export default cloudRouter;



