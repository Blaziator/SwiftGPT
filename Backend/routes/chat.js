import express from "express";
import { Router} from "express";
import Thread from "../models/thread.js";
import getAIApiResponse from "../utils/ai.js";

const router = express.Router();

router.get("/thread", async(req, res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt: -1});
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

router.get("/thread/:threadId", async(req,res)=>{
    const {threadId} = req.params;
    
    try{
        const threadRes = await Thread.findOne({threadId});

        if(!threadRes){
            return res.status(404).json({error: "Thread not found."});
        }

        res.json(threadRes.messages);
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch chat"}); 
    }
});

router.delete("/thread/:threadId", async(req,res)=>{
    const {threadId} = req.params;
    
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread){
            return res.status(404).json({error: "Thread not found."});
        }

        res.status(200).json({success: "Thread deleted successfully."});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to delete chat"}); 
    }
});

router.post("/chat", async(req, res)=>{
    const {threadId, message} = req.body;

    if(!threadId || !message){
        return res.status(400).json({error: "Missing required fields."});
    }

    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            thread = new Thread({
                threadId,
                title: message,
                messages: [{
                    role: "user",
                    content: message
                }]
            });
        }else{
            thread.messages.push({role: "user",content: message});
        }

        const conversationHistory = thread.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const assistantReply = await getAIApiResponse(conversationHistory);

        thread.messages.push({role: "assistant",content: assistantReply})
        thread.updatedAt = new Date();
        
        await thread.save();
        res.json({reply: assistantReply});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "Something Went Wrong!!"});
    }
})

export default router;