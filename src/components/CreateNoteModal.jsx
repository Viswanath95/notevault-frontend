import { useState } from 'react'
import { useFetch } from '../hooks/useFetch'
import styles from './CreateNoteModal.module.css'

const COLOURS = ['#ffffff', '#f28b82', '#fbbc04', '#ccff90', '#a8d8ea', '#d7aefb', '#fdcfe8']

function CreateNoteModal({ onClose, onNoteCreated }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        colour: '#ffffff',
        isPinned: false,
    })

    const { loading, error, execute } = useFetch('/notes');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await execute('POST', formData);
            onNoteCreated(data.note)
            onClose()
        }catch {
            //
        }
    }

    // close on backdrop click
    const handleBackdropClick = (e) => {
        if(e.target === e.currentTarget) onClose()
    }

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>New note</h2>
                    <button className={styles.closeBtn} onClick={onClose}>X</button>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                 <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        className={styles.input}
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        className={styles.textarea}
                        name="content"
                        placeholder="Write your note..."
                        value={formData.content}
                        onChange={handleChange}
                        rows={5}
                    />

                    {/* Colour picker */}
                    <div className={styles.colourRow}>
                        <span className={styles.colourLabel}>Colour</span>
                        <div className={styles.colourOptions}>
                        {COLOURS.map(colour => (
                            <button
                            key={colour}
                            type="button"
                            className={styles.colourDot}
                            onClick={() => setFormData(prev => ({ ...prev, colour }))}
                            style={{
                                backgroundColor: colour,
                                outline: formData.colour === colour
                                ? '2px solid #1a1a1a'
                                : '2px solid transparent',
                            }}
                            />
                        ))}
                        </div>
                    </div>

                    {/* Pin toggle */}
                    <label className={styles.checkboxRow}>
                        <input
                        type="checkbox"
                        name="isPinned"
                        checked={formData.isPinned}
                        onChange={handleChange}
                        />
                        <span className={styles.checkboxLabel}>Pin this note</span>
                    </label>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                        >
                        Cancel
                        </button>
                        <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                        >
                        {loading ? 'Creating...' : 'Create note'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default CreateNoteModal