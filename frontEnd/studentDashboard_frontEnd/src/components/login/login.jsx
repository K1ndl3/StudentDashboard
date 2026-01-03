import { useNavigate } from "react-router-dom"
import "./login.css"
import { useState } from "react"


function Login() {
    const [token, setToken] = useState("")
    const navigate = useNavigate()

    const logInSubmit = async () =>{
        try {
        const res = await fetch("/auth/dev-token", {
            method : "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token})
        })

        if (res.status == 204) {
            navigate("/dashboard")
        } else if (res.status == 401) {
            alert("Invalid Token. Please try again with the correct token.")
        } else if (res.status == 403) {
            alert("Token does not have privilege to access resource.")
        }else {
            alert("Canvas API Not Available. Please try the guest features.")
            } 
        }catch (err) {
      console.error(err);
      alert("Network error!");
        }
    }
    
    return (
        <div className="login-container">
            <div className="text">
                <h3 className="login-title">Scholar Sync</h3>
                <h1>Welcome</h1>
                <svg className="scholar-hat" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 50 15 L 85 35 L 85 40 Q 85 45 80 45 L 65 45 L 65 55 Q 65 60 60 60 L 40 60 Q 35 60 35 55 L 35 45 L 20 45 Q 15 45 15 40 L 15 35 Z" fill="rgb(63, 41, 186)" stroke="rgb(63, 41, 186)" strokeWidth="3"/>
                    <path d="M 50 65 L 50 75" stroke="rgb(63, 41, 186)" strokeWidth="3" strokeLinecap="round"/>
                </svg>
            </div>
            <div className="button-bar">
                <input className="input"
                    type="password"
                    value={token}
                    placeholder="Canvas Developer Token"
                    onChange={e => setToken(e.target.value)}>
                </input>
                <button className="login-button"
                    onClick={logInSubmit}
                >
                    Log in
                </button>
                <button className="test-button"
                    onClick={() => navigate("/guest-dashboard")}
                >
                    Log in as Guest
                </button>
            </div>
        </div>
    )
}

export default Login