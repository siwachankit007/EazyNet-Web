"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { eazynetAPI } from '@/lib/eazynet-api'
import { createClient } from '@/lib/supabase/client'
import { useLoading } from '@/components/loading-context'
import type { User, Session } from '@supabase/supabase-js'

// Define user and session types for both authentication methods
interface EazyNetUser {
  id: string
  email: string
  name: string
}

interface EazyNetSession {
  token: string
  refreshToken: string
  user: EazyNetUser | null
}

// Union type for user - can be either EazyNet or Supabase user
type AuthUser = EazyNetUser | User
type AuthSession = EazyNetSession | Session

interface AuthContextType {
  user: AuthUser | null
  session: AuthSession | null
  isLoading: boolean
  signOut: () => Promise<void>
  isAuthenticated: boolean
  updateAuthState: (user: EazyNetUser | null, session: EazyNetSession) => void
  updateSupabaseAuthState: (user: User, session: Session) => void
  fetchUserProfile: () => Promise<void>
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
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isRedirectingRef = useRef(false)
  const router = useRouter()
  const pathname = usePathname()
  const { showGlobalLoading, hideGlobalLoading } = useLoading()
  const supabase = createClient()

  // Check if current route requires auth checking
  const isProtectedRoute = useMemo(() => PROTECTED_ROUTES.some(route => pathname.startsWith(route)), [pathname])
  const isAuthRoute = useMemo(() => AUTH_ROUTES.some(route => pathname.startsWith(route)), [isProtectedRoute])
  const requiresAuthCheck = useMemo(() => isProtectedRoute || isAuthRoute, [isProtectedRoute, isAuthRoute])

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
        
        // Check if user is authenticated via EazyNet backend
        if (eazynetAPI.isAuthenticated()) {
          const tokenUser = eazynetAPI.getUserFromToken()
          if (tokenUser) {
            // Create temporary user data from token (will be updated with fresh data)
            const tempUserData: EazyNetUser = {
              id: (tokenUser.sub as string) || (tokenUser.id as string) || '',
              email: (tokenUser.email as string) || '',
              name: (tokenUser.name as string) || 'User'
            }
            
            const sessionData: EazyNetSession = {
              token: eazynetAPI.getToken()!,
              refreshToken: eazynetAPI.getRefreshToken()!,
              user: tempUserData
            }
            
            log('Initial EazyNet session loaded from token', {
              hasUser: !!tempUserData,
              userEmail: tempUserData.email,
              userName: tempUserData.name
            })

            setSession(sessionData)
            setUser(tempUserData)
            setIsLoading(false)

            // Fetch fresh profile data from backend
            try {
              const profileData = await eazynetAPI.getProfile()
              if (profileData && profileData.name !== 'User') {
                const freshUserData: EazyNetUser = {
                  id: profileData.id,
                  email: profileData.email,
                  name: profileData.name
                }
                setUser(freshUserData)
                
                // Update session with fresh user data
                const updatedSessionData: EazyNetSession = {
                  ...sessionData,
                  user: freshUserData
                }
                setSession(updatedSessionData)
              }
            } catch (error) {
              console.error('Error fetching fresh profile data:', error)
              // Keep using token data if profile fetch fails
            }

            // Handle initial redirect based on session
            if (isAuthRoute) {
              handleRedirect('/dashboard')
            }
          } else {
            // Invalid token, clear and redirect
            eazynetAPI.logout()
            if (isProtectedRoute) {
              handleRedirect('/auth')
            }
            setIsLoading(false)
          }
        } else {
          // Check if user is authenticated via Supabase (Google OAuth)
          const { data: { session: supabaseSession } } = await supabase.auth.getSession()
          
          if (supabaseSession?.user) {
            log('Initial Supabase session loaded', {
              hasUser: !!supabaseSession.user,
              userEmail: supabaseSession.user.email
            })

            setSession(supabaseSession)
            setUser(supabaseSession.user)
            setIsLoading(false)

            // Handle initial redirect based on session
            if (isAuthRoute) {
              handleRedirect('/dashboard')
            }
          } else {
            // User is not authenticated
            if (isProtectedRoute) {
              handleRedirect('/auth')
            }
            setIsLoading(false)
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

    // Listen for Supabase auth state changes (Google OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, supabaseSession) => {
      if (!isMounted) return

      log('Supabase auth state change', `${event} ${supabaseSession?.user?.email}`)
      
      if (supabaseSession?.user && event === 'SIGNED_IN') {
        try {
          // Convert Supabase OAuth user to EazyNet user via backend
          const oauthData = {
            provider: 'google',
            accessToken: supabaseSession.access_token,
            idToken: supabaseSession.provider_token || undefined
          }

          // Login via EazyNet backend with OAuth data
          const authResponse = await eazynetAPI.oauthLogin(oauthData)
          
          // Create unified user data
          const unifiedUser: EazyNetUser = {
            id: authResponse.user.id,
            email: authResponse.user.email,
            name: authResponse.user.name
          }

          // Create unified session
          const unifiedSession: EazyNetSession = {
            token: authResponse.token,
            refreshToken: authResponse.refreshToken,
            user: unifiedUser
          }

          // Set unified auth state
          setUser(unifiedUser)
          setSession(unifiedSession)
          setIsLoading(false)

          // Handle redirect
          if (isAuthRoute) {
            handleRedirect('/dashboard')
          }

          log('OAuth user converted to EazyNet user', unifiedUser)
        } catch (error) {
          console.error('Failed to convert OAuth user to EazyNet user:', error)
          
          // Fallback to Supabase-only auth if backend integration fails
          setSession(supabaseSession)
          setUser(supabaseSession.user)
          setIsLoading(false)
          
          if (isAuthRoute) {
            handleRedirect('/dashboard')
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        if (isProtectedRoute) {
          handleRedirect('/auth')
        }
      }
    })
    
    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [handleRedirect, pathname, requiresAuthCheck, isProtectedRoute, isAuthRoute, supabase.auth])

  const updateAuthState = useCallback((user: EazyNetUser | null, session: EazyNetSession) => {
    log('updateAuthState called', { userEmail: user?.email, userName: user?.name, isAuthRoute, pathname })
    setUser(user)
    setSession(session)
    
    // If user is on auth page and successfully authenticated, redirect to dashboard
    if (isAuthRoute) {
      log('User authenticated on auth page, redirecting to dashboard')
      handleRedirect('/dashboard')
    }
  }, [isAuthRoute, handleRedirect, pathname])

  const updateSupabaseAuthState = useCallback((user: User, session: Session) => {
    setUser(user)
    setSession(session)
    
    // If user is on auth page and successfully authenticated, redirect to dashboard
    if (isAuthRoute) {
      handleRedirect('/dashboard')
    }
  }, [isAuthRoute, handleRedirect])

  const fetchUserProfile = useCallback(async () => {
    try {
      // All users now go through EazyNet backend
      if (eazynetAPI.isAuthenticated()) {
        const profileData = await eazynetAPI.getProfile()
        if (profileData) {
          const userData: EazyNetUser = {
            id: profileData.id,
            email: profileData.email,
            name: profileData.name
          }
          setUser(userData)
          log('User profile fetched and set:', userData)
        }
      } else {
        // Redirect to auth page if not authenticated
        handleRedirect('/auth')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Redirect to auth page on error
      handleRedirect('/auth')
    }
  }, [handleRedirect])

  const signOut = useCallback(async () => {
    try {
      log('Starting sign out process')
      showGlobalLoading()
      
      // Check which auth method to use for logout
      if (eazynetAPI.isAuthenticated()) {
        await eazynetAPI.logout()
      } else if (user && 'aud' in user) { // Supabase user has 'aud' property
        await supabase.auth.signOut()
      }
      
      // Clear local state
      setUser(null)
      setSession(null)
      
      // Redirect to auth page
      if (isProtectedRoute) {
        handleRedirect('/auth')
      }
    } catch (error) {
      console.error('Sign out exception:', error)
    } finally {
      hideGlobalLoading()
    }
  }, [showGlobalLoading, hideGlobalLoading, isProtectedRoute, handleRedirect, user, supabase.auth])

  const value: AuthContextType = {
    user,
    session,
    isLoading: requiresAuthCheck ? isLoading : false, // Don't show loading for public routes
    signOut,
    isAuthenticated: !!user || !!session,
    updateAuthState,
    updateSupabaseAuthState,
    fetchUserProfile
  }

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('AuthContext value:', {
      hasUser: !!user,
      userEmail: user?.email,
      hasSession: !!session,
      isLoading,
      isAuthenticated: !!user || !!session,
      pathname,
      isAuthRoute,
      isProtectedRoute,
      requiresAuthCheck
    })
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