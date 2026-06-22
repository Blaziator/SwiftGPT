import './App.css';
import ChatWindow from './Components/ChatWindow.jsx';
import Sidebar from './Components/Sidebar.jsx';
import { MyContext } from './Context/MyContext.jsx';
import AuthProvider from './Context/AuthProvider.jsx';
import { useState, useContext, useEffect } from 'react';
import {v1 as uuidv1} from "uuid";
import { AuthContext } from './Context/AuthContext.jsx';
import AuthForm from './Components/AuthForm.jsx';
import { DotLoader } from "react-spinners";

function AppContent() {
  const { currentUser, authLoading } = useContext(AuthContext);

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(() => uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth > 768);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    isSidebarOpen, setIsSidebarOpen
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (authLoading) {
    return <div className="app authLoadingScreen">
      <DotLoader color="#fff" size={100} />
    </div>;
  }

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
      <Sidebar></Sidebar>
      <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  );
}

function App() {

  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  )
}

export default App