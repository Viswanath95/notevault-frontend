import { Navigate } from 'react-router-dom'
import useAuth from '../context/AuthContext'

function ProtectedRoute({ children }) {
    const { isLoggedIn } = useAuth();

    if(!isLoggedIn) {
        return <Navigate to="/login" replace />  // not logged in → redirect
    }

    return children // logged in → render the Notes page
}

export default ProtectedRoute