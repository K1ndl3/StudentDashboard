import { useNavigate } from "react-router-dom";
import "./login.css";
import { useState } from "react";
import useAuth from "../../context/AuthContext/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const logInSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // update AuthContext state and localStorage via login()
        login(data.token);
        console.log(data.token);
        navigate("/dashboard");
      } else if (res.status === 401) {
        alert("Account Unauthorized.");
      } else if (res.status === 403) {
        alert("Username or password is incorrect. Try again");
      } else {
        alert("Server is not available or Log in information is missing.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error!");
    }
  };

  return (
    <div className="login-container">
      <div className="text">
        <h3 className="login-title">Scholar Sync</h3>
        <h1>Welcome</h1>
        <svg
          className="scholar-hat"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50 15 L 85 35 L 85 40 Q 85 45 80 45 L 65 45 L 65 55 Q 65 60 60 60 L 40 60 Q 35 60 35 55 L 35 45 L 20 45 Q 15 45 15 40 L 15 35 Z"
            fill="rgb(63, 41, 186)"
            stroke="rgb(63, 41, 186)"
            strokeWidth="3"
          />
          <path
            d="M 50 65 L 50 75"
            stroke="rgb(63, 41, 186)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="button-bar">
        <input
          className="input"
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <span className="button-span">
          <button className="login-button" onClick={logInSubmit}>
            Log in
          </button>
          <button className="forgot-password-button">Forgot Password</button>
        </span>
        <span className="button-span">
          <button
            className="test-button"
            onClick={() => navigate("/guest-dashboard")}
          >
            Log in as Guest
          </button>
          <button
            className="register-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </span>
      </div>
    </div>
  );
}

export default Login;
