"use client"

import { ReactNode, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface RouteGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireGuest?: boolean
  fallback?: ReactNode
}

export function RouteGuard({ 
  children, 
  requireAuth = false, 
  requireGuest = false,
  fallback = null 
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect authenticated users away from guest-only pages (like auth page)
  useEffect(() => {
    if (!isLoading && requireGuest && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isLoading, requireGuest, isAuthenticated, router])

  // Redirect unauthenticated users away from protected pages
  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isLoading, requireAuth, isAuthenticated, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-gray-800 font-semibold text-lg">Checking authentication...</p>
            <p className="text-gray-500 text-sm mt-1">Please wait while we verify your session</p>
          </div>
        </div>
      </div>
    )
  }

  // Require authentication but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access this page.</p>
        </div>
      </div>
    )
  }

  // Require guest (not authenticated) but user is authenticated
  if (requireGuest && isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Already Signed In</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  // Show children if all conditions are met
  return <>{children}</>
} 