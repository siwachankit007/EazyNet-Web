"use client"

import { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react'

interface LoadingContextType {
  loadingStates: Record<string, boolean>
  setLoading: (key: string, isLoading: boolean) => void
  isLoading: (key: string) => boolean
  globalLoading: boolean
  setGlobalLoading: (loading: boolean) => void
  showGlobalLoading: () => void
  hideGlobalLoading: () => void
  withLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [globalLoading, setGlobalLoadingState] = useState(false)
  const globalLoadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const setLoading = useCallback((key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }))
  }, [])

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const setGlobalLoading = useCallback((loading: boolean) => {
    if (globalLoadingTimeoutRef.current) {
      clearTimeout(globalLoadingTimeoutRef.current)
      globalLoadingTimeoutRef.current = null
    }
    setGlobalLoadingState(loading)
  }, [])

  const showGlobalLoading = useCallback(() => {
    if (globalLoadingTimeoutRef.current) {
      clearTimeout(globalLoadingTimeoutRef.current)
      globalLoadingTimeoutRef.current = null
    }
    setGlobalLoadingState(true)
  }, [])

  const hideGlobalLoading = useCallback(() => {
    if (globalLoadingTimeoutRef.current) {
      clearTimeout(globalLoadingTimeoutRef.current)
    }
    // Small delay to prevent flickering for very fast operations
    globalLoadingTimeoutRef.current = setTimeout(() => {
      setGlobalLoadingState(false)
      globalLoadingTimeoutRef.current = null
    }, 100)
  }, [])

  const withLoading = useCallback(async <T,>(key: string, fn: () => Promise<T>): Promise<T> => {
    setLoading(key, true)
    showGlobalLoading()
    
    try {
      const result = await fn()
      return result
    } finally {
      setLoading(key, false)
      hideGlobalLoading()
    }
  }, [setLoading, showGlobalLoading, hideGlobalLoading])

  return (
    <LoadingContext.Provider value={{ 
      loadingStates, 
      setLoading, 
      isLoading, 
      globalLoading, 
      setGlobalLoading, 
      showGlobalLoading, 
      hideGlobalLoading,
      withLoading
    }}>
      {children}
      {globalLoading && <GlobalLoadingOverlay />}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

export function LoadingSpinner({ size = 'sm', color = 'current' }: { size?: 'sm' | 'md' | 'lg', color?: 'current' | 'white' | 'blue' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  const colorClasses = {
    current: 'text-current',
    white: 'text-white',
    blue: 'text-blue-600'
  }

  return (
    <svg className={`inline mr-2 animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}

function GlobalLoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-3 border-white/30 rounded-full animate-spin border-t-blue-500"></div>
      </div>
    </div>
  )
} 