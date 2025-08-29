"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"
import { useLoading } from "@/components/loading-context"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmNewPassword: ""
  })
  
  const { isLoading, withLoading } = useLoading()
  const router = useRouter()

  // Clean up password reset flags when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('isPasswordResetFlow')
      localStorage.removeItem('isPasswordResetSession')
    }
  }, [])

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_]).{8,}$/
    return passwordRegex.test(password)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!validatePassword(formData.newPassword)) {
      setValidationError("Password must be at least 8 characters with uppercase, lowercase, number, and special character")
      return
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setValidationError("Passwords do not match")
      return
    }

    await withLoading('reset-password', async () => {
      try {
        // Get tokens from URL
        const hash = window.location.hash
        const hashParams = new URLSearchParams(hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        if (!accessToken || !refreshToken) {
          throw new Error('Reset tokens not found. Please request a new password reset link.')
        }

        // Set session temporarily for password update (with flag to prevent redirects)
        const supabase = createClient()
        
        // Set flags in localStorage to indicate we're in password reset flow
        localStorage.setItem('isPasswordResetFlow', 'true')
        localStorage.setItem('isPasswordResetSession', 'true') // Additional flag for auth context
        
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (sessionError) {
            console.error('Session error:', sessionError)
            throw new Error('Invalid reset link. Please request a new password reset link.')
          }

          // Verify session is established
          const { data: { session } } = await supabase.auth.getSession()
          
          if (!session) {
            throw new Error('Failed to establish session. Please try again.')
          }

          // Update the password using the established session
          const { error: updateError } = await supabase.auth.updateUser({
            password: formData.newPassword
          })

          if (updateError) {
            console.error('Password update error:', updateError)
            
            // Handle specific password validation errors
            if (updateError.message.includes('New password should be different from the old password')) {
              throw new Error('New password must be different from your current password. Please choose a different password.')
            } else if (updateError.message.includes('Password should be at least')) {
              throw new Error('Password must meet minimum requirements. Please check the password rules above.')
            } else {
              throw new Error(updateError.message)
            }
          }
          
          // Sign out the user after password reset so they can log in fresh
          await supabase.auth.signOut()
          
          // Only set success and redirect if password update actually succeeded
          setIsSubmitted(true)
          toast.success("Password has been reset successfully! You can now log in with your new password.")
          
          // Redirect to login page after 1 second (user needs to log in again)
          setTimeout(() => {
            router.push('/auth')
          }, 1000)
          
        } finally {
          // Always clean up the flags, regardless of success or failure
          localStorage.removeItem('isPasswordResetFlow')
          localStorage.removeItem('isPasswordResetSession')
        }
              } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to reset password. Please try again.'
          setValidationError(errorMessage)
        }
    })
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-green-800 mb-2">Password Reset Successful!</h3>
          <p className="text-green-700">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <p className="text-sm text-green-600 mt-2">
            Redirecting to login page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Reset your password</h2>
        <p className="text-gray-600 mt-2">
          Enter your new password below. Your new password must be different from your current password.
        </p>
      </div>

      {/* Validation Error Display */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{validationError}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="pl-10 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters with uppercase, lowercase, number, and special character. 
            <br />
            <span className="text-orange-600 font-medium">Note: New password must be different from your current password.</span>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              className="pl-10 pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading('reset-password')}
        >
          {isLoading('reset-password') ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  )
}
