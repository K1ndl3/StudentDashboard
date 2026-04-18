// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setIsAuth(true);
            setToken(storedToken);
        }
    }, []);

    const login = (userToken) => {
        setIsAuth(true);
        setToken(userToken);
        localStorage.setItem("token", userToken);
    };

    const logout = () => {
        setIsAuth(false);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ isAuth, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// This is the hook your ProtectedRoute and Login use
export function useAuth() {
    return useContext(AuthContext);
}

export default useAuth;