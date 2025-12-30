import { useNavigate } from "react-router-dom"
import "./login.css"
import { useState } from "react"


function Login() {
    const [token, setToken] = useState("")
    const navigate = useNavigate()

    const logInSubmit = async () =>{
        try {
        const res = await fetch("auth/dev-token", {
            method : "Post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token})
        })

        if (res.ok) {
            navigate("/dashboard")
        } else {
            alert("Invalid Token. Try again")
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
            </div>
        </div>
    )
}

export default Login