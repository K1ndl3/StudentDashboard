import { createContext, useContext, useEffect, useState } from "react";
import {useAuth} from "../AuthContext/AuthContext"
import { useCallback } from "react";
const UserContext = createContext(null)


export function UserProvider({children}) {
    const {token, isAuth} = useAuth()
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchUserGlobalData = useCallback(async () => {
        if (!token) return 
        setIsLoading(true)
        try {
            const response = await fetch("http://localhost:8080/api/context/load", {
                method: 'GET',
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setUserData(data)
                console.log(data)
            } else {
                throw new Error("Cannot fetch user details")
            }
        } catch (error) {
            console.log(error)
            alert("Cannot fetch user data right now. Try again")
        } finally {
            setIsLoading(false)
        }
    }, [token])

    useEffect(() => {
        if (token) {
            fetchUserGlobalData()
        } else {
            setUserData(null)
        }
    }, [token, fetchUserGlobalData])

    return (<UserContext.Provider value={{ 
            userData, 
            isLoading, 
            refreshData: fetchUserGlobalData
        }}>
            {children}
        </UserContext.Provider>);
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};