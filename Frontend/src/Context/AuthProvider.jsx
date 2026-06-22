import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.jsx";

export default function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const checkSession = async()=>{
        try{
            const response = await fetch(`${apiUrl}/api/auth/me`, {
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data.user);
            } else {
                setCurrentUser(null);
            }
        }catch(err){
            console.log(err);
            setCurrentUser(null);
        }
        setAuthLoading(false);
    };

    useEffect(() => {
        checkSession();
    }, []);

    const signup = async(name, email, password)=>{
        const response = await fetch(`${apiUrl}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Signup failed.");
        }

        setCurrentUser(data.user);
        return data.user;
    };

    const login = async (email, password)=>{
        const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.error || "Login failed.");
        }

        setCurrentUser(data.user);
        return data.user;
    };

    const logout = async()=>{
        try {
            await fetch(`${apiUrl}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.log(err);
        }

        setCurrentUser(null);
    };

    const authValues = {currentUser, authLoading, signup, login, logout};

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
}
