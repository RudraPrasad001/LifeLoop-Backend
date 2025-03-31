import express from "express";
import router from "./Routes/mainRoutes.js"; 
import cors from 'cors';
import dotenv from 'dotenv';
import mongose from './dbConnection/db.js';
import cookieParser from "cookie-parser";
import cloudRouter from "./Routes/uploadRoutes.js";
dotenv.config();
const app = express();
app.use(cookieParser());
app.use(cors({origin: "http://localhost:5173", // Frontend URL
    credentials: true}));
app.use(express.json());
mongose();
app.use('/app',router);
app.use('/upload',cloudRouter);
let PORT = process.env.PORT;
app.listen(PORT,()=>{console.log(`Server is running on ${PORT}`)});