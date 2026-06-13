import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../api/axiosInstance'
 
export function useFetch(url) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    const abortRef = useRef(null)

   const execute = useCallback(async (method = 'GET', body = null, config = {}) => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)

    const signal = { signal: abortRef.current.signal, ...config }

    try {
        let res

        switch(method.toUpperCase()) {
            case 'GET': res = await api.get(url, signal);     break
            case 'POST': res = await api.post(url, body, signal); break
            case 'PUT': res = await api.put(url, body, signal); break
            case 'DELETE': res = await api.delete(url, signal); break
            default: throw new Error(`Unsupported method: ${method}`)
        }

        setData(res.data)
        return res.data
    }catch (err) {
        if(err.name === 'CanceledError') return
        setError(err.response?.data?.message || 'Something went wrong.')
        throw err
    }finally {
        setLoading(false)
    }
   }, [url])

   useEffect(() => () => abortRef.current?.abort(), [])

   return { data, loading, error, execute }
}