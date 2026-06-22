import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/chat.js";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use("/api", router);
app.use("/api/auth", authRouter);

const connectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
  }catch(err){
    console.log(`Failed to connect to the Database. Error: ${err}`);
    process.exit(1);
  }
}

connectDB().then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server is running on : ${PORT}`); 
  });
})