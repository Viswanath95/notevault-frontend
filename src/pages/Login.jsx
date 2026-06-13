import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import useAuth from '../context/AuthContext'
import styles from '../styles/Auth.module.css'
import api from '../api/axiosInstance'
 
function Login() {
    const { login } = useAuth();
    const { loading, error, execute } = useFetch('/auth/login')

    // Add form state 
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('')

    // Show session expired message on mount
    useEffect(() => {
        const authMessage = sessionStorage.getItem('authMessage')
        if(authMessage) {
            setAuthError(authMessage)
            sessionStorage.removeItem('authMessage') // show once only
        }
    }, [])
    
    // Add handle change
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({ ...prev, [name]: value}));
    };

    // Add handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await execute('POST', formData);
            login(data);
        }catch {
            //
        }   
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>NoteVault</h1>
                <p className={styles.subtitle}>Welcome back</p>

                {authError && (
                    <p className={styles.error}>{authError}</p>
                )}
       
                { error && <p className={styles.error}>{error}</p>}
       
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input 
                                className={styles.input}
                                type="email"
                                name="email"
                                placeholder="john@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Password</label>
                            <div className={styles.passwordWrapper}>
                            <input 
                                className={styles.input}
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className={styles.eyeButton}
                                onClick={() => setShowPassword(prev => !prev)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                { showPassword ? <Eye size={16} /> : <EyeOff size={16} /> }
                            </button>
                            </div>
                        </div>
                        <button className={styles.button} type="submit" disabled={loading}>
                            { loading ? 'Logging in...' : 'Login' }
                        </button>
                    </form>
                    <p className={styles.link}>
                       No account yet? <Link to="/register">Register</Link>
                    </p>
            </div>
        </div>
    )
}

export default Login