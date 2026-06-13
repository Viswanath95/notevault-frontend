import useAuth from '../context/AuthContext'
import useTheme from '../context/ThemeProvider';
import { Sun, Moon, Search, X, LogOut } from 'lucide-react';
import styles from './Navbar.module.css'

function Navbar({ searchQuery, onSearchChange }) {
    const { email, logout } = useAuth();
    const { theme, toggleTheme } = useTheme()

    return (
        <nav className={styles.nav}>
            <h1 className={styles.logo}>NoteVault</h1>
            {/* Search bar */}
            <div className={styles.searchWrapper}>
                <span className={styles.searchIcon}><Search /></span>
                <input 
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={e => onSearchChange(e.target.value)}
                />
            {/* Clear button — only shows when something is typed */}
            {searchQuery && (
                <button
                    className={styles.clearBtn}
                    onClick={() => onSearchChange('')}
                    title="Clear Search"
                >
                    <X />
                </button>
            )}
            </div>

            <div className={styles.right}>
                <span className={styles.email}>{email}</span>

                  {/* Theme toggle */}
                <button
                    className={styles.themeBtn}
                    onClick={toggleTheme}
                    title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                <button 
                    className={styles.logoutBtn} 
                    onClick={logout}
                >
                    <span className={styles.logoutText}>Logout</span>
                    <LogOut className={styles.logoutIcon}/>
                </button>
            </div>
        </nav>
    )
}

export default Navbar