import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User", 
      required: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    likes: {
      type: [String], 
      default: [],
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tags:{
      type:String,
      required:true,
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
