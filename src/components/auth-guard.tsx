"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useLoading } from "@/components/loading-context"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { showGlobalLoading, hideGlobalLoading } = useLoading()

  useEffect(() => {
    const checkAuth = async () => {
      // Quick check using session first
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setIsAuthenticated(false)
        showGlobalLoading()
        router.push('/auth')
        // Hide loading after a short delay to ensure smooth transition
        setTimeout(() => {
          hideGlobalLoading()
        }, 300)
        setIsLoading(false)
        return
      }
      
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setIsAuthenticated(false)
        showGlobalLoading()
        router.push('/auth')
        // Hide loading after a short delay to ensure smooth transition
        setTimeout(() => {
          hideGlobalLoading()
        }, 300)
      } else if (session?.user) {
        setIsAuthenticated(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase.auth, showGlobalLoading, hideGlobalLoading])

  // Show loading state while checking authentication
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

  // Show fallback or redirect if not authenticated
  if (!isAuthenticated) {
    return fallback || null
  }

  // Render children if authenticated
  return <>{children}</>
} 