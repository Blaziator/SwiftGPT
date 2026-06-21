import { useContext, useEffect } from "react";
import "./Sidebar.css";
import { FaPenToSquare } from "react-icons/fa6";
import { MyContext } from "../Context/MyContext";
import { v1 as uuidv1 } from "uuid";
import { FaTrash } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

export default function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    reply,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/thread`);
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [reply]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    setPrompt("");
    try {
      const response = await fetch(
        `${apiUrl}/api/thread/${newThreadId}`,
      );
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async(threadId)=>{
    try{
        const response = await fetch(`${apiUrl}/api/thread/${threadId}`, {method: "DELETE"});

        if(!response.ok){
          console.log("Failed to delete thread.")
          return;
        }
        
        const res = await response.json();
        getAllThreads();

        if(threadId === currThreadId){
          createNewChat();
        }
    }catch(err){
        console.log(err);
    }
  }

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src="src/assets/swiftgpt_logo_four_petal_pinwheel.png" alt="GPT Logo" />
        <FaPenToSquare size={17} />
      </button>

      <ul className="history customScrollbar">
        {allThreads?.map((thread, idx) => (
          <li key={idx} onClick={() => changeThread(thread.threadId)} className={thread.threadId === currThreadId? "highlighted": ""}>
            <span className="threadTitle">{thread.title}</span> 
            <FaTrashCan size={15} className="trashIcon" onClick={(e)=> {
                e.stopPropagation();
                deleteThread(thread.threadId);
            }} />
          </li>
        ))}
      </ul>
      <div className="sign">
        <p>Made with love &hearts;</p>
      </div>
    </section>
  );
}
