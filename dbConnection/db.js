import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
const mongose =expressAsyncHandler( async()=>mongoose.connect(process.env.CONNECTION_STRING)
.then(async ()=>{console.log("db connected");})
.catch((e)=>{console.log("Error catched "+ e);}));

export default mongose;