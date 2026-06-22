import './App.css';
import ChatWindow from './Components/ChatWindow.jsx';
import Sidebar from './Components/Sidebar.jsx';
import { MyContext } from './Context/MyContext.jsx';
import AuthProvider from './Context/AuthProvider.jsx';
import { useState, useContext } from 'react';
import {v1 as uuidv1} from "uuid";
import { AuthContext } from './Context/AuthContext.jsx';
import AuthForm from './Components/AuthForm.jsx';
import { SyncLoader } from "react-spinners";

function AppContent() {
  const { currentUser, authLoading } = useContext(AuthContext);

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(() => uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  if (authLoading) {
    return <div className="app authLoadingScreen">
      <SyncLoader color="#fff" speedMultiplier={0.5} size={10} />
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