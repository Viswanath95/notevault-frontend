import { useState, useEffect } from 'react'
import { useFetch } from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import { useInfiniteNotes } from '../hooks/useInfiniteNotes'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import EmptyState from '../components/EmptyState'
import CreateNoteModal from '../components/CreateNoteModal'
import styles from './Notes.module.css'

function Notes() {
    const [showModal, setShowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchNotes, setSearchNotes] = useState(null) // null = not searching
    const [isSearching, setIsSearching] = useState(false)

    const {
        notes,
        page,
        isFetching,
        hasNextPage,
        loadMore,
        addNote,
        updateNote,
        removeNote,
    } = useInfiniteNotes()

    // sentinel ref - attach to div at bottom of notes list
    const sentinelRef = useIntersectionObserver(loadMore)

    const { execute: searchExecute } = useFetch('/notes/search')

    const debounceSearchQuery = useDebounce(searchQuery, 400);

    useEffect(() => {
        const fetchSearch = async () => {
            try {
                if(!debounceSearchQuery.trim()) {
                    setSearchNotes(null) 
                    return
                }

                // Search notes
                setIsSearching(true)

                const data = await searchExecute(
                    'GET',
                    null,
                    {
                        params: {
                            q: debounceSearchQuery
                        }
                    }
                )

                if(data) setSearchNotes(data.notes)
            }catch (error) {
                console.error(error)
            }finally {
                setIsSearching(false)
            }
        }
        fetchSearch()
    }, [debounceSearchQuery])

     // use search results if searching, otherwise use infinite notes
    // derived display state
    const displayNotes = searchNotes ?? notes // searchNotes = search notes, notes = useIntersectionObserver
    const isSearchMode = searchNotes !== null
    // Sepearte pinned and unpinned notes
    const pinnedNotes = displayNotes?.filter(n => n.isPinned)
    const unpinnedNotes = displayNotes?.filter(n => !n.isPinned)

    return (
        <div className={styles.page}>
            <Navbar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            <main className={styles.main}>

                {/* Search status */}
                {isSearching && (
                    <p className={styles.loadingText}>Searching...</p>
                )}

                {isSearchMode && !isSearching && (
                    <p className={styles.searchStatus}>
                        {displayNotes.length === 0
                            ? `No results for "${searchQuery}"`
                            : `${displayNotes.length} result${displayNotes.length !== 1 ? 's' : ''} for "${searchQuery}"`
                        }
                    </p>
                )}

                {/* Empty state */}
                 {!isFetching && !isSearchMode && notes.length === 0 && (
                    <EmptyState />
                 )}

                {/* Pinned notes section */}
                {pinnedNotes.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Pinned</h2>
                        <div className={styles.grid}>
                            {pinnedNotes.map(note => (
                                <NoteCard 
                                    key={note._id} 
                                    note={note} 
                                    onNoteDeleted={removeNote}
                                    onNoteUpdated={updateNote}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* All other notes */}
                {unpinnedNotes.length > 0 && (
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            {isSearchMode ? 'Results' : 'All notes'}
                        </h2>
                        <div className={styles.grid}>
                            {unpinnedNotes.map(note => (
                                <NoteCard 
                                    key={note._id} 
                                    note={note} 
                                    onNoteDeleted={removeNote}
                                    onNoteUpdated={updateNote}
                                />
                            ))}
                        </div>
                    </section>
                )}

                  {/* ── Sentinel — Intersection Observer watches this ── */}
                {!isSearchMode && (
                    <div ref={sentinelRef} className={styles.sentinel}>
                        {isFetching && (
                            <div className={styles.spinner}>
                                <div className={styles.spinnerDot} />
                                <div className={styles.spinnerDot} />
                                <div className={styles.spinnerDot} />
                            </div>
                        )}
                        {!hasNextPage && notes.length > 0 && (
                            <p className={styles.endText}>
                                You've reached the end ✓
                            </p>
                        )}
                    </div>
                )}

            </main>

             {/* FAB — opens modal */}
            <button className={styles.fab} onClick={() => setShowModal(true)}>+</button>

            {/* Modal — only renders when open */}
            {showModal && (
                <CreateNoteModal 
                    onClose={() => setShowModal(false)}
                    onNoteCreated={addNote}
                />
            )}
        </div>
    )
}

export default Notes