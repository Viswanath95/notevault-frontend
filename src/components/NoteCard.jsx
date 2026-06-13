import { useState, useEffect, useRef } from 'react'
import { Trash2, Pin, Palette } from 'lucide-react'
import styles from './NoteCard.module.css'
import { useFetch } from '../hooks/useFetch'
import { useNavigate } from 'react-router-dom'

const COLOURS = ['#ffffff', '#f28b82', '#fbbc04', '#ccff90', '#a8d8ea', '#d7aefb', '#fdcfe8']

function NoteCard({ note, onNoteDeleted, onNoteUpdated }) {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isEditingContent, setIsEditingContent] = useState(false)
    const [showColours, setShowColours] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [updateError, setUpdateError] = useState(null)
    const navigate = useNavigate()

    // Single source of truth for all fields

    const [editedNote, setEditedNote] = useState({
        title: note.title,
        content: note.content || '',
        colour: note.colour || '#ffffff',
        isPinned: note.isPinned || false,
    })

    const titleRef = useRef(null)
    const contentRef = useRef(null)
    const colourPickerRef = useRef(null)

    const { execute: save, loading: saving } = useFetch(`/notes/${note._id}`)
    const { execute: remove } = useFetch(`/notes/${note._id}`)

    // Whenever the colour picker opens by accidentally or after user open colour picker don't want to change any colour need to close the color picker
    useEffect(() => {
        if(!showColours) return;

        const handleColourKeyDown = (e) => {
            if(e.key === 'Escape') {
                setShowColours(false)
            }
        }

        const handleColourClickOutside = (e) => {
            if(colourPickerRef.current && !colourPickerRef.current.contains(e.target)) {
                setShowColours(false)
            }
        }

        document.addEventListener('keydown', handleColourKeyDown)
        document.addEventListener('mousedown', handleColourClickOutside)

        return () => {
           document.removeEventListener('keydown', handleColourKeyDown)
           document.removeEventListener('mousedown', handleColourClickOutside) 
        }
    }, [showColours])

    const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    })

    // Core Save - always sends ALL fields
    const saveNote = async (overrides = {}) => {
        setUpdateError(null)

        const payload = {...editedNote, ...overrides}

        // Guard - title must not be empty
        if(!payload.title?.trim()) {
            setUpdateError('Title must not be empty')
            setEditedNote(prev => ({ ...prev, title: note.title }))
            return
        }

        try {
            const data = await save('PUT', {
                title: payload.title.trim(),
                content: payload.content.trim(),
                colour: payload.colour,
                isPinned: payload.isPinned,
            })

            if(data?.note) {
                onNoteUpdated(data.note)
            }else {
                throw new Error('Update failed')
            }
        }catch {
            setUpdateError('Failed to update note. Please try again.')
             // revert local state back to last known good values
             setEditedNote({
                title: note.title,
                content: note.content || '',
                colour: note.colour || '#ffffff',
                isPinned: note.isPinned || false,
             })

        }
    }

    // Title handlers
    const handleTitleSave = async () => {
        setIsEditingTitle(false)
        if(editedNote.title.trim() === note.title.trim()) return // no change
        await saveNote()
    }

    const handleTitleKeyDown = (e) => {
        if(e.key === 'Enter') { e.preventDefault(); titleRef.current?.blur() }
        if(e.key === 'Escape') {
            setEditedNote(prev => ({ ...prev, title: note.title }))
            setIsEditingTitle(false)
        }
    }

    // Content handlers
    const handleContentSave = async () => {
        setIsEditingContent(false)
        if(editedNote.content.trim() === (note.content || '').trim()) return // no change
        await saveNote()
    }

    const handleContentKeyDown = (e) => {
        if(e.key === 'Enter') { e.preventDefault(); contentRef.current?.blur() }
        if(e.key === 'Escape') {
            setEditedNote(prev => ({ ...prev, content: note.content || '' }))
            setIsEditingContent(false)
        }
    }

    // Pin toggle - immedaitely saves
    const handlePinToggle = async (e) => {
        e.stopPropagation()
        const newIsPinned = !editedNote.isPinned
        setEditedNote(prev => ({ ...prev, isPinned: newIsPinned }))
        await saveNote({ isPinned: newIsPinned })
    }

    // Colour change - immediately saves
    const handleColourChange = async (colour) => {
        setShowColours(false)
        if(colour === editedNote.colour) return // no change
        setEditedNote(prev => ({ ...prev, colour }))
        await saveNote({ colour })
    }

    // Delete
    const handleDelete = async (e) => {
        e.stopPropagation() // prevent card click firing when delete clicked
        if(!window.confirm('Delete this note?')) return

        setDeleting(true)
        try {
            // await execute('DELETE')
            await remove('DELETE')
            onNoteDeleted(note._id)  // remove from parent state ✅
            navigate('/notes')
        }catch {
            setUpdateError('Failed to delete note.')
            setDeleting(false) // reset on failure
        }
    }

    return (
        <div ref={colourPickerRef} className={styles.card} style={{'--card-border-color': editedNote.colour || '#e0e0e0' }}>

            {saving && <p className={styles.savingText}>Saving...</p>}

              {/* ── Error banner ── */}
            {updateError && (
                <div className={styles.errorBanner}>
                    <p className={styles.errorText}>{updateError}</p>
                    <button
                        className={styles.errorClose}
                        onClick={() => setUpdateError(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* ── Title ── */}
            <div className={styles.header}>
                {isEditingTitle ? (
                    <input
                        ref={titleRef}
                        className={styles.titleInput}
                        value={editedNote.title}
                        onChange={e => setEditedNote(prev => ({ ...prev, title: e.target.value }))}
                        onBlur={handleTitleSave}
                        onKeyDown={handleTitleKeyDown}
                        autoFocus
                    />
                ) : (
                    <h3
                        className={styles.title}
                        onClick={() => setIsEditingTitle(true)}
                        title="Click to edit title"
                    >
                        {editedNote.title}
                    </h3>
                )}

                <button
                    className={`${styles.iconBtn} ${editedNote.isPinned ? styles.pinned : ''}`}
                    onClick={handlePinToggle}
                    title={editedNote.isPinned ? 'Unpin' : 'Pin note'}
                >
                    <Pin size={15} />
                </button>
            </div>

            {/* ── Content ── */}
            {isEditingContent ? (
                <textarea
                    ref={contentRef}
                    className={styles.contentTextarea}
                    value={editedNote.content}
                    onChange={e => setEditedNote(prev => ({ ...prev, content: e.target.value }))}
                    onBlur={handleContentSave}
                    onKeyDown={handleContentKeyDown}
                    autoFocus
                    rows={4}
                />
            ) : (
                <p
                    className={styles.content}
                    onClick={() => setIsEditingContent(true)}
                    title="Click to edit content"
                >
                    {editedNote.content?.length > 150
                        ? editedNote.content.slice(0, 150) + '...'
                        : editedNote.content || (
                            <span className={styles.placeholder}>Click to add content...</span>
                        )}
                </p>
            )}

            {/* Colour picker */}
            {showColours && (
            <div className={styles.colourRow}>
                <span className={styles.colourLabel}>Colour</span>
                    <div className={styles.colourOptions}>
                        {COLOURS.map(colour => (
                            <button
                                key={colour}
                                type="button"
                                className={styles.colourDot}
                                onClick={() => handleColourChange(colour)}
                                style={{
                                    backgroundColor: colour,
                                    outline: editedNote.colour === colour
                                        ? '2px solid var(--text-primary)'
                                        : '2px solid transparent',
                                }}
                            />
                        ))}
                    </div>
            </div>
            )}

            {/* ── Footer ── */}
            <div className={styles.footer}>
                <p className={styles.date}>{formattedDate}</p>
                <div className={styles.actions}>
                    <button
                        className={styles.iconBtn}
                        onClick={e => { e.stopPropagation(); setShowColours(p => !p) }}
                        title="Change colour"
                    >
                        <Palette size={15} />
                    </button>
                    <button
                        className={styles.iconBtn}
                        onClick={handleDelete}
                        disabled={deleting}
                        title="Delete note"
                    >
                        {deleting ? '...' : <Trash2 size={15} />}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NoteCard