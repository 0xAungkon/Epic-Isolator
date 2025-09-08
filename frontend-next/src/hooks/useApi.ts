'use client'

import { useState } from 'react'

interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export function useApi<T>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false
  })

  const request = async (
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setState(prev => ({ ...prev, data, loading: false }))
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      throw error
    }
  }

  const get = (url: string) => request(url, { method: 'GET' })
  const post = (url: string, data: any) => request(url, { method: 'POST', body: JSON.stringify(data) })
  const put = (url: string, data: any) => request(url, { method: 'PUT', body: JSON.stringify(data) })
  const del = (url: string) => request(url, { method: 'DELETE' })

  return {
    ...state,
    get,
    post,
    put,
    delete: del,
  }
}