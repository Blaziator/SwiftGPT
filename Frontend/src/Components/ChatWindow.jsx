import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { HiChevronDown } from "react-icons/hi";
import { MdAccountCircle } from "react-icons/md";
import { IoArrowUp } from "react-icons/io5";
import { MyContext } from "../Context/MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

export default function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;
    setNewChat(false);
    setLoading(true);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, options);
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //Append new chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply]);

  return (
    <div className="chatWindow">
      <div className="navbar">
        <button className="model">
          SwiftGPT <HiChevronDown size={20} />
        </button>
        <div className="userIconDiv">
          <MdAccountCircle size={28} />
        </div>
      </div>

      <Chat></Chat>

      <SyncLoader
        color="#fff"
        speedMultiplier={0.5}
        loading={loading}
        size={10}
      ></SyncLoader>
      <div className="chatInput">
        <div className="inputBox">
          <textarea
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);

              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                getReply();
              }
            }}
            className="customScrollbar"
          />

          <button className="send-btn" onClick={getReply} disabled={!prompt.trim()}>
            <IoArrowUp size={20} className="send-icon" />
          </button>
        </div>
        <p className="info">
          SwiftGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
