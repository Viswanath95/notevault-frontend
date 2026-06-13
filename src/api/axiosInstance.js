import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

// attach token automatically to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle expired/invalid token globally
api.interceptors.response.use(
    (response) => response, // pass through successful responses
    (error) => {

        if(error.response?.status === 401) {
            // clear stored auth data
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('email')

            // store a message to show on login page
            sessionStorage.setItem('authMessage', 'Authentication failed, please login again.')

            // redirect to login - full reload clears all stale state
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api