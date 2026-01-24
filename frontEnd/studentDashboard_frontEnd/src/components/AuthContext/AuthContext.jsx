import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null)

export function AuthProvider({children}) {
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        const storedAuth = localStorage.getItem("isAuth")
        if (storedAuth === "true") {
            setIsAuth(true)
        }
    }, [])
    
    const login = () => {
        setIsAuth(true)
        localStorage.setItem("isAuth", "true")
    }

    const logout = () => {
        setIsAuth(false)
        localStorage.removeItem("isAuth")
    }

    return (
        <AuthContext.Provider value={{isAuth, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default function useAuth() {
    return useContext(AuthContext)
}