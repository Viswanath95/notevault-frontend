import { useEffect, useRef } from 'react'

export function useIntersectionObserver(callback, options = {}) {
    const sentinelRef = useRef(null) // attach to the div at bottom of list

    useEffect(() => {

        const observer = new IntersectionObserver(([entry]) => {
            if(entry.isIntersecting) {
                callback()            // fires when sentinel enters viewport
            }
        }, {
            root: null,               // viewport
            rootMargin: '0px',
            threshold: 0.1,           // 10% of sentinel visible = trigger
            options,
        })

        const el = sentinelRef.current
        if(el) observer.observe(el)

        return () => {
            if(el) observer.unobserve(el) // cleanup
        }

    }, [callback]);

    return sentinelRef;
}