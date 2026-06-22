import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import "dotenv/config";
import {requireAuth} from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", async(req, res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({error: "All fields are required."});
    }

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({error: "An account with this email already exists."});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        const token = jwt.sign(
            {userId: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7*24*60*60*1000
        });

        res.status(201).json({
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    }catch(err){
        console.log(err);
        res.status(500).json({error: "Something went wrong during signup."});
    }
});

router.post("/login", async(req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "Email and password both are required."});
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ error: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({error: "Invalid email or password."});
        }

        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Something went wrong during login." });
    }
});

router.get("/me", requireAuth, async(req, res)=>{
    try{
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({ error: "Something went wrong." });
    }
});

router.post("/logout", (req, res)=>{
    res.clearCookie("token",{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });
    res.status(200).json({ success: "Logged out successfully." });
});

export default router;