import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";
function Login() {
    const navigate = useNavigate();


    // Store what the user types
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Store messages
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Runs when form is submitted
    async function handleSubmit(event) {
        event.preventDefault(); // prevent page refresh

        setMessage("");
        setError("");

        try {
            const response = await fetch("http://localhost:5160/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Login successful!");
                navigate("/dashboard");
               

            } else {
                setError(data.message || "Login failed.");
            }

        } catch (err) {
            setError("Could not connect to server.");
        }
    }

    return (
        <div className="loginContainer">
            <h2>Account Login</h2>
            <div className="loginBox">
            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email:</label><br />
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" style={{ marginTop: "15px" }}>
                    Login
                </button>

                </form>
            </div>

            {message && <p style={{ color: "green"}}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Login;
