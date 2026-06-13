import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import  useAuth  from '../context/AuthContext'
import styles from '../styles/Auth.module.css'

function Register() {
    const { register } = useAuth();
    const { loading, error, execute } = useFetch('/auth/register')

    // Add form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    // Add handlechange
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Add handleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await execute('POST', formData);
            register(data); 
        } catch {
                //
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>NoteVault</h1>
                <p className={styles.subtitle}>Create your account</p>

                { error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Name</label>
                        <input 
                            className={styles.input}
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                            placeholder="Min 8 characters"
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
                        { loading ? 'Registering...' : 'Register' }
                    </button>
                </form>
                <p className={styles.link}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register