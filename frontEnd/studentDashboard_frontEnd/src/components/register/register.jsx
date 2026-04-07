import "./register.css"

function Register() {

    return (<>
        <div className="register-container">
            <h1>Register Your Account </h1>
            <input type="text"
                   placeholder="Enter name" />
            <input type="text"
                   placeholder="Enter password" />
            <input type="text"
                   placeholder="Enter email" />
        </div>
    
    </>)
}

export default Register