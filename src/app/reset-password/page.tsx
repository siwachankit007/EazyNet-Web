"use client"

import { useEffect, useState, Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import  Footer  from "@/components/footer"
import { ResetPasswordForm } from "@/components/reset-password-form"
import { RouteGuard } from "@/components/route-guard"

function ResetPasswordContent() {
  const [hasResetToken, setHasResetToken] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simply check if we have the reset tokens in the URL
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash
      
      // Parse the URL fragments
      const hashParams = new URLSearchParams(hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const type = hashParams.get('type')
      
      if (accessToken && type === 'recovery') {
        setHasResetToken(true)
        setIsLoading(false)
      } else {
        setError('Invalid reset link. Please request a new password reset link.')
        setIsLoading(false)
      }
    } else {
      setError('No reset token found. Please request a new password reset link.')
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <RouteGuard requireGuest>
        <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
          <Navigation />
          <div className="flex flex-col justify-center items-center px-4 py-8 min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-white mb-2">Processing password reset...</h1>
              <p className="text-white/80">Please wait while we set up your password reset form.</p>
            </div>
          </div>
          <Footer />
        </div>
      </RouteGuard>
    )
  }

  if (error) {
    return (
      <RouteGuard requireGuest>
        <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
          <Navigation />
          <div className="flex flex-col justify-center items-center px-4 py-8 min-h-screen">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-white">Password Reset Error</h1>
              <p className="text-white/80 mt-2">{error}</p>
            </div>
            
            <Card className="w-full max-w-md">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Please request a new password reset link from the login page.
                </p>
                <a
                  href="/auth"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go to Login
                </a>
              </CardContent>
            </Card>
          </div>
          <Footer />
        </div>
      </RouteGuard>
    )
  }

  if (hasResetToken) {
    return (
      <RouteGuard requireGuest>
        <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
          <Navigation />
          <div className="flex flex-col justify-center items-center px-4 py-8 min-h-screen">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold text-white">Reset Your Password</h1>
              <p className="text-white/80 mt-2">Enter your new password below to complete the reset.</p>
            </div>
            
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <ResetPasswordForm />
              </CardContent>
            </Card>
          </div>
          <Footer />
        </div>
      </RouteGuard>
    )
  }

  return null
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
        <Navigation />
        <div className="flex flex-col justify-center items-center px-4 py-8 min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-2">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
