import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    followers:{
        type:[String]
    },
    following:{
        type:[String]
    },
    outgoingRequest:{
        type:[String]
    },
    incomingRequest:{
        type:[String]
    }
},
{
    timestamps:true
}

);
const User = mongoose.model("User",userSchema);
export default User;