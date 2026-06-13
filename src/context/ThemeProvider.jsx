import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem('theme') || 'light' // persist across refresh
    )

    // apply theme to <html> element — CSS variables pick it up
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return(
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default function useTheme() {
    const context = useContext(ThemeContext)
    if(!context) {
        throw new Error('useTheme must be used inside ThemeProvider')
    }
    return context
}