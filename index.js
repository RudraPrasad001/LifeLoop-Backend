import express from "express";
import router from "./Routes/mainRoutes.js"; 
import cors from 'cors';
import dotenv from 'dotenv';
import mongose from './dbConnection/db.js';
import cookieParser from "cookie-parser";
import cloudRouter from "./Routes/uploadRoutes.js";
import profileRouter from "./Routes/profileRoutes.js";
dotenv.config();
const app = express();const allowedOrigins = [process.env.URL,'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow the request
    } else {
      callback(new Error('Not allowed by CORS'), false); // block the request
    }
  },
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
mongose();

app.use('/app',router);
app.use('/upload',cloudRouter);
app.use('/profile',profileRouter);
let PORT = process.env.PORT;
app.listen(PORT,()=>{console.log(`Server is running on ${PORT}`)});