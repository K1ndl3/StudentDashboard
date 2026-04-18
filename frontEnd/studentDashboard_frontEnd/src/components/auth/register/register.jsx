import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./register.css"


function Register() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const submitRegistration = async () => {

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email
                })
            })
    
            const data = await response.json();
            console.log(data)
            
        if (response.ok) {
                localStorage.setItem('token', data.token);
                alert("Registration successful!");
                navigate("/login")
            } else if (response.status === 400) {
            alert("Cannot register. Check your fields")
                setErrors(data); 
            } else if (response.status === 409) {
                alert(data.message || "User already exists!");
            }
        } catch (error) {
            console.error("Connection failed:", error);
        }
    }

    return (<>
        <div className="register-container">
            <h1>Register Your Account </h1>
            <input type="text"
                   placeholder="Enter username"
                   onChange={(e) => setUsername(e.target.value)} />
            <input type="text"
                   placeholder="Enter password"
                   onChange={(e) => setPassword(e.target.value)} />
            <input type="text"
                   placeholder="Enter email"
                   onChange={(e) => setEmail(e.target.value)} />

            <span className="button-span">
                <button
                   onClick={submitRegistration}
                >Register</button>
                <button
                    onClick={() => navigate("/login")}
                >Back to Log-in</button>
            </span>

            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={.75} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
        </div>
    
    </>)
}

export default Register