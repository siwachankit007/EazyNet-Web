"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Mail, ArrowLeft } from "lucide-react"
import { useLoading } from "@/components/loading-context"
import { eazynetAPI } from "@/lib/eazynet-api"

interface ForgotPasswordFormProps {
  onBack: () => void
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  
  const { isLoading, withLoading } = useLoading()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!validateEmail(email)) {
      setValidationError("Please enter a valid email address")
      return
    }

    await withLoading('forgot-password', async () => {
      try {
        // Call the backend API to send password reset email
        const response = await eazynetAPI.forgotPassword(email)
        
        setIsSubmitted(true)
        toast.success(response.message || "If an account with this email exists, a password reset link has been sent.")
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email. Please try again.'
        setValidationError(errorMessage)
      }
    })
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-green-800 mb-2">Check your email</h3>
          <p className="text-green-700">
            We&apos;ve sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-green-600 mt-2">
            If you don&apos;t see it, check your spam folder.
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="w-full"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Forgot your password?</h2>
        <p className="text-gray-600 mt-2">
          Enter your email address and we&apos;ll send you a link to reset your password.
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
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading('forgot-password')}
        >
          {isLoading('forgot-password') ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="w-full"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Sign In
      </Button>
    </div>
  )
}
