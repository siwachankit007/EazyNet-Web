"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import { useLoading } from '@/components/loading-context'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function for conditional logging
const log = (message: string, data?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`AuthContext: ${message}`, data || '')
  }
}

// Define protected and auth routes
const PROTECTED_ROUTES = ['/dashboard', '/profile']
const AUTH_ROUTES = ['/auth']

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isRedirectingRef = useRef(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { showGlobalLoading, hideGlobalLoading } = useLoading()

  // Check if current route requires auth checking
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  const requiresAuthCheck = isProtectedRoute || isAuthRoute

  // Centralized redirect logic with debouncing
  const handleRedirect = useCallback((targetPath: string) => {
    if (isRedirectingRef.current || pathname === targetPath) {
      return
    }

    log('Redirecting to:', targetPath)
    isRedirectingRef.current = true
    showGlobalLoading()
    
    router.push(targetPath)
    
    // Hide loading after navigation completes
    const timer = setTimeout(() => {
      hideGlobalLoading()
      isRedirectingRef.current = false
    }, 300)

    return () => clearTimeout(timer)
  }, [router, pathname, showGlobalLoading, hideGlobalLoading])

  // Single effect to handle all auth state and redirects
  useEffect(() => {
    let isMounted = true

    const getInitialSession = async () => {
      try {
        // Only check auth for protected or auth routes
        if (!requiresAuthCheck) {
          log('Skipping auth check for public route:', pathname)
          setIsLoading(false)
          return
        }

        log('Getting initial session for protected/auth route:', pathname)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!isMounted) return

        log('Initial session loaded', {
          hasUser: !!session?.user,
          userEmail: session?.user?.email
        })

        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        // Handle initial redirect based on session
        if (session?.user) {
          // User is authenticated
          if (isAuthRoute) {
            handleRedirect('/dashboard')
          }
        } else {
          // User is not authenticated
          if (isProtectedRoute) {
            handleRedirect('/auth')
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes (only for protected/auth routes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only handle auth changes for protected/auth routes
      if (!requiresAuthCheck) {
        log('Skipping auth state change for public route:', pathname)
        return
      }

      log('Auth state change', `${event} ${session?.user?.email}`)
      
      if (!isMounted) return

      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)

      // Handle auth state changes
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user && isAuthRoute) {
            handleRedirect('/dashboard')
          }
          break
        case 'SIGNED_OUT':
          if (isProtectedRoute) {
            handleRedirect('/auth')
          }
          break
        case 'TOKEN_REFRESHED':
        case 'INITIAL_SESSION':
          // No redirect needed for token refresh or initial session
          break
        default:
          // Only log truly unhandled events
          if (!['SIGNED_IN', 'SIGNED_OUT', 'TOKEN_REFRESHED', 'INITIAL_SESSION'].includes(event)) {
            log('Unhandled auth event:', event)
          }
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [handleRedirect, pathname, requiresAuthCheck, isProtectedRoute, isAuthRoute, supabase.auth])

  const signOut = useCallback(async () => {
    try {
      log('Starting sign out process')
      showGlobalLoading()
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        hideGlobalLoading()
      }
      // Auth state change listener will handle the redirect
    } catch (error) {
      console.error('Sign out exception:', error)
      hideGlobalLoading()
    }
  }, [supabase.auth, showGlobalLoading, hideGlobalLoading])

  const value: AuthContextType = {
    user,
    session,
    isLoading: requiresAuthCheck ? isLoading : false, // Don't show loading for public routes
    signOut,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 