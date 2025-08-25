"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { eazynetAPI, type JwtPayload } from '@/lib/eazynet-api'
import { createClient } from '@/lib/supabase/client'
import { useLoading } from '@/components/loading-context'
import { log } from '@/lib/utils'
import type { User, Session } from '@supabase/supabase-js'

// Define user and session types for both authentication methods
interface EazyNetUser {
  id: string
  email: string
  name: string
  isPro?: boolean
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
  isPro: boolean
  updateAuthState: (user: EazyNetUser | null, session: EazyNetSession) => void
  updateSupabaseAuthState: (user: User, session: Session) => void
  fetchUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function for conditional logging
const authLog = (message: string, data?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    log.debug(`AuthContext: ${message}`, data || '')
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
  const isAuthRoute = useMemo(() => AUTH_ROUTES.some(route => pathname.startsWith(route)), [pathname])
  const requiresAuthCheck = useMemo(() => isProtectedRoute || isAuthRoute, [isProtectedRoute, isAuthRoute])

  // Centralized redirect logic with debouncing
  const handleRedirect = useCallback((targetPath: string) => {
    if (isRedirectingRef.current || pathname === targetPath) {
      return
    }

    authLog('Redirecting to:', targetPath)
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
        // Always check auth state for all routes, but only redirect for protected/auth routes
        
        // Check if user is authenticated via EazyNet backend
        // First refresh token state from localStorage to ensure we have the latest
        eazynetAPI.refreshTokenState()
        const eazynetAuthStatus = eazynetAPI.isAuthenticated()
        
        if (eazynetAuthStatus) {
          const tokenUser = eazynetAPI.getUserFromToken()
          if (tokenUser) {
            // Create temporary user data from token (will be updated with fresh data)
            const tempUserData: EazyNetUser = {
              id: (tokenUser.sub as string) || (tokenUser.id as string) || '',
              email: (tokenUser.email as string) || '',
              name: (tokenUser.name as string) || 'User',
              isPro: Boolean((tokenUser as JwtPayload).isPro) || false
            }
            
            const sessionData: EazyNetSession = {
              token: eazynetAPI.getToken()!,
              refreshToken: eazynetAPI.getRefreshToken()!,
              user: tempUserData
            }
            


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
                name: profileData.name,
                isPro: profileData.isPro
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

            // Handle initial redirect based on session (only for protected/auth routes)
            if (isAuthRoute) {
              handleRedirect('/dashboard')
            }
          } else {
            // Invalid token, clear and redirect (only for protected routes)
            eazynetAPI.logout()
            if (isProtectedRoute) {
              handleRedirect('/auth')
            }
            setIsLoading(false)
          }
        } else {
          // Check if user is authenticated via Supabase (Google OAuth)
          // Only check Supabase if we don't have EazyNet tokens to avoid conflicts
          const { data: { session: supabaseSession } } = await supabase.auth.getSession()
          
          if (supabaseSession?.user) {


            setSession(supabaseSession)
            setUser(supabaseSession.user)
            setIsLoading(false)

            // Handle initial redirect based on session (only for protected/auth routes)
            if (isAuthRoute) {
              handleRedirect('/dashboard')
            }
          } else {
            // User is not authenticated - only redirect for protected routes
            if (isProtectedRoute) {
              handleRedirect('/auth')
            }
            setIsLoading(false)
          }
        }
        
        // Ensure loading is set to false for public routes if we haven't set it yet
        if (!requiresAuthCheck && isMounted) {
          setIsLoading(false)
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
            name: authResponse.user.name,
            isPro: authResponse.user.isPro
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

          // Handle redirect (only for protected/auth routes)
          if (isAuthRoute) {
            handleRedirect('/dashboard')
          }


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

        
        // Clear both Supabase and EazyNet auth states
        setSession(null)
        setUser(null)
        
        // Also clear EazyNet tokens if they exist
        if (eazynetAPI.isAuthenticated()) {
  
          eazynetAPI.logout()
        }
        
        // Redirect to auth page if on protected route
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

    setUser(user)
    setSession(session)
    
    // If user is on auth page and successfully authenticated, redirect to dashboard
    if (isAuthRoute) {
      handleRedirect('/dashboard')
    }
  }, [isAuthRoute, handleRedirect])

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
              // Don't fetch profile if we're in the middle of signing out
        if (!eazynetAPI.isAuthenticated()) {
          // Redirect to auth page if not authenticated
          handleRedirect('/auth')
          return
        }

      // All users now go through EazyNet backend
      const profileData = await eazynetAPI.getProfile()
      if (profileData) {
        const userData: EazyNetUser = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
          isPro: profileData.isPro
        }
        setUser(userData)
        
        // Also update the session with the latest profile data
        if (session && 'token' in session) {
          const updatedSession = {
            ...session,
            user: userData
          }
          setSession(updatedSession)
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // Only redirect to auth page on error if we're not already signing out
      if (user || session) {
        handleRedirect('/auth')
      }
    }
  }, [handleRedirect, user, session])

  const signOut = useCallback(async () => {
    try {
      showGlobalLoading()
      
      // For OAuth users, we need to clear both EazyNet and Supabase sessions
      // Check if user is authenticated via EazyNet backend
      if (eazynetAPI.isAuthenticated()) {
        await eazynetAPI.logout()
      }
      
      // Always clear Supabase session for OAuth users
      // This ensures Google OAuth session is properly terminated
      try {
        await supabase.auth.signOut()
      } catch (supabaseError) {
        console.warn('Supabase sign out failed (may not be signed in):', supabaseError)
      }
      
      // Clear local state
      setUser(null)
      setSession(null)
      
      // Always redirect to auth page after sign out, regardless of current route
      handleRedirect('/auth')
    } catch (error) {
      console.error('Sign out exception:', error)
      // Even if there's an error, clear local state and redirect
      setUser(null)
      setSession(null)
      handleRedirect('/auth')
    } finally {
      hideGlobalLoading()
    }
  }, [showGlobalLoading, hideGlobalLoading, handleRedirect, supabase.auth])

  const value: AuthContextType = {
    user,
    session,
    isLoading: requiresAuthCheck ? isLoading : false, // Don't show loading for public routes
    signOut,
    isAuthenticated: !!user || !!session,
    isPro: (user as EazyNetUser)?.isPro || false,
    updateAuthState,
    updateSupabaseAuthState,
    fetchUserProfile
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