import { useState, useEffect, useCallback } from 'react'
import { useFetch } from './useFetch'

export function useInfiniteNotes() {
    const [notes, setNotes] = useState([])
    const [page, setPage] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [isFetching, setIsFetching] = useState(false)

    const { execute } = useFetch('/notes')

    // Fetch a single page and append to notes
    const fetchPage = useCallback(async (pageNum) => {
        if(isFetching) return // prevent duplicate calls

        setIsFetching(true)
        try {
            const data = await execute(
                'GET',
                null,
                {
                    params: {
                        page: pageNum,
                        limit: 6

                    }
                }
            )


            if(data) {
                setNotes(prev => 
                    pageNum === 1
                    ? data.notes  // first page -> replace
                    : [...prev, ...data.notes] // next pages -> append 

                )
                setHasNextPage(data.pagination.hasNextPage)
                setPage(pageNum)
            }

        }catch {
            //
        }finally {
            setIsFetching(false)

        }

    }, [])

    // fetch page 1 on mount
    useEffect(() => {
        fetchPage(1)
    }, [fetchPage])

    // load next page
    const loadMore = useCallback(() => {
        if(!hasNextPage || isFetching) return;
        fetchPage(page + 1)
    }, [page, hasNextPage, isFetching, fetchPage])

    // Note state handlers
    // Create Note
    const addNote = (newNote) => {
        setNotes(prev => 
            newNote.isPinned
            ? [newNote, ...prev]
            : [...prev.filter(n => n.isPinned), newNote, ...prev.filter(n => !n.isPinned)]
        )
    }

    // Update Note
    const updateNote = useCallback((updatedNote) => {
        setNotes(prev => {
            const updated = prev.map(n =>
                n._id === updatedNote._id ? updatedNote : n
            )
            return [
                ...updated.filter(n => n.isPinned),
                ...updated.filter(n => !n.isPinned),
            ]
        })
    }, [])

    // Delete Note
    const removeNote = (deletedId) => {
        setNotes(prev => prev.filter(n => n._id !== deletedId))
    }

    return {
        notes,
        page,
        isFetching,
        hasNextPage,
        loadMore,
        addNote,
        updateNote,
        removeNote,
    }
}
