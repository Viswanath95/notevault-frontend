//Using Context API
import { createContext, useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'


const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const navigate = useNavigate()

    // initialize from localStorage so refresh doesn't log user out
    const [token, setToken] = useState(() => localStorage.getItem('token') || null)
    const [userId, setUserId] = useState(() => localStorage.getItem('userId') || null)
    const [email, setEmail] = useState(() => localStorage.getItem('email') || null)

     const register = (data) => {
        // data = { token, userId, email } from your API response
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('email', data.user.email)

        setToken(data.token)
        setUserId(data.user.id)
        setEmail(data.user.email)

        navigate('/notes')
    }

    const login = (data) => {
        // data = { token, userId, email } from your API response
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.userId)
        localStorage.setItem('email', data.email)

        setToken(data.token)
        setUserId(data.userId)
        setEmail(data.email)

        navigate('/notes')
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('email')

        setToken(null)
        setUserId(null)
        setEmail(null)

        navigate('/login')
    }

    const value = {
        token,
        userId,
        email,
        isLoggedIn: !!token, // !!token - True or false(Either token is present or not)
        register,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

 // custom hook — use this in every component instead of useContext(AuthContext)
 export default function useAuth() {
    const context = useContext(AuthContext)

    if(!context) {
        throw new Error('useAuth must be used inside AuthProvider')
    }
    return context
 }