import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import jwtAuth from "../middlewares/jwtAuthentication.js";

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
    console.log(result.secure_url);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).send({ message: "Error uploading to Cloudinary" });
  }
});

export default cloudRouter;



