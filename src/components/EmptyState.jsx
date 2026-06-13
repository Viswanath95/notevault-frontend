import styles from './EmptyState.module.css'
import { StickyNote } from 'lucide-react'

function EmptyState() {
    return (
        <div className={styles.wrapper}>
            <p className={styles.icon}><StickyNote size={16} /></p>
            <h3 className={styles.title}>No notes yet</h3>
            <p className={styles.sub}>Click the + button to create your first note</p>
        </div>
    )
}

export default EmptyState