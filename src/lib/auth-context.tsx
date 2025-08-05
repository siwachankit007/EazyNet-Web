"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react'
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const hasHandledInitialSession = useRef(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const { showGlobalLoading, hideGlobalLoading } = useLoading()

  // Set the initial session flag immediately to prevent race conditions
  useEffect(() => {
    hasHandledInitialSession.current = true
  }, [])

  // Handle redirects based on auth state and current path
  useEffect(() => {
    if (!hasInitialized || isRedirecting) {
      console.log('AuthContext: Skipping redirect check', {
        hasInitialized,
        isRedirecting
      })
      return
    }

    const isAuthPage = pathname === '/auth'
    const isProtectedPage = ['/dashboard', '/profile'].includes(pathname)

    console.log('AuthContext: Checking redirects', {
      user: !!user,
      pathname,
      isAuthPage,
      isProtectedPage,
      hasInitialized,
      isRedirecting,
      hasHandledInitialSession: hasHandledInitialSession.current
    })

    // Only redirect if we're on the wrong page for our auth state
    if (user && isAuthPage) {
      console.log('AuthContext: Redirecting authenticated user from /auth to /dashboard')
      setIsRedirecting(true)
      showGlobalLoading()
      router.push('/dashboard')
      setTimeout(() => {
        hideGlobalLoading()
        setIsRedirecting(false)
      }, 300)
    } else if (!user && isProtectedPage) {
      console.log('AuthContext: Redirecting unauthenticated user to /auth')
      setIsRedirecting(true)
      showGlobalLoading()
      router.push('/auth')
      setTimeout(() => {
        hideGlobalLoading()
        setIsRedirecting(false)
      }, 300)
    } else {
      console.log('AuthContext: No redirect needed - user is on correct page')
    }
  }, [user, hasInitialized, pathname, router, showGlobalLoading, hideGlobalLoading, isRedirecting])

  useEffect(() => {
    let isMounted = true

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('AuthContext: Getting initial session...')
        const { data: { session } } = await supabase.auth.getSession()
        
        if (isMounted) {
          console.log('AuthContext: Initial session loaded', {
            hasUser: !!session?.user,
            userEmail: session?.user?.email
          })
          setSession(session)
          setUser(session?.user ?? null)
          setIsLoading(false)
          setHasInitialized(true)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        if (isMounted) {
          setIsLoading(false)
          setHasInitialized(true)
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthContext: Auth state change:', event, session?.user?.email)
      
      if (isMounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
        setHasInitialized(true)

        // Only handle actual sign in/out events, not session refreshes
        if (event === 'SIGNED_IN' && session?.user) {
          // If we've already handled the initial session, this is likely a session refresh, not a real sign in
          if (hasHandledInitialSession.current) {
            console.log('AuthContext: Session refresh detected, not redirecting')
          } else {
            console.log('AuthContext: Real sign in detected, redirecting to dashboard')
            setIsRedirecting(true)
            showGlobalLoading()
            router.push('/dashboard')
            setTimeout(() => {
              hideGlobalLoading()
              setIsRedirecting(false)
            }, 300)
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('AuthContext: User signed out, redirecting to auth')
          hasHandledInitialSession.current = false // Reset for next sign in
          setIsRedirecting(true)
          showGlobalLoading()
          router.push('/auth')
          setTimeout(() => {
            hideGlobalLoading()
            setIsRedirecting(false)
          }, 300)
        } else {
          console.log('AuthContext: Other auth event:', event, '- not redirecting')
        }
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [router, supabase.auth, showGlobalLoading, hideGlobalLoading])

  const signOut = async () => {
    try {
      console.log('AuthContext: Starting sign out process')
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
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
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