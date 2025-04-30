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
        type:Array
    },
    following:{
        type:Array
    },
    outgoingRequest:{
        type:Array
    },
    incomingRequest:{
        type:Array
    }
},
{
    timestamps:true
}

);
const User = mongoose.model("User",userSchema);
export default User;