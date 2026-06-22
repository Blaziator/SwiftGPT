import "./AuthForm.css";
import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext.jsx";

export default function AuthForm({ onSuccess }) {
    const {signup, login} = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            if (isLoginMode) {
                await login(email, password);
            } else {
                await signup(name, email, password);
            }
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err.message);
        }

        setSubmitting(false);
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError("");
    };
        
    return(
        <div className="authWrapper">
            <form className="authForm" onSubmit={handleSubmit}>
                <h1>{isLoginMode? "Welcome back" : "Create your account"}</h1>

                {!isLoginMode && (
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />

                {error && <p className="authError">{error}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting? "Please wait..." : isLoginMode? "Log in" : "Sign up"}
                </button>

                <p className="authToggle">
                    {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                    <span onClick={toggleMode}>{isLoginMode ? "Sign up" : "Log in"}</span>
                </p>
            </form>
        </div>
    )
}