import { useNavigate } from "react-router-dom"
import "./login.css"
import { useState } from "react"


function Login() {
    const [token, setToken] = useState("")
    const navigate = useNavigate()

    const logInSubmit = async () =>{
        try {
        const res = await fetch("auth/dev-token", {
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
                    onClick={() => navigate("/dashboard")}
                >
                    Test Dashboard
                </button>
            </div>
        </div>
    )
}

export default Login