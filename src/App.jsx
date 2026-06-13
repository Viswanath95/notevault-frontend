import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeProvider'
import Login from './pages/Login'
import Register from './pages/Register'
import Notes from './pages/Notes'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>               {/* ← wraps all routes */}
        <Routes>
          {/* {Public routes} */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* {Protected route - Only accessible when logged in} */}
          <Route 
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />

          {/* {Redirect route -> /notes} */}
          <Route path="/" element={<Navigate to="/notes" replace />} />

          {/* {Catch-all -> /login} */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
