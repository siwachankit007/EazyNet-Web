"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useLoading } from "@/components/loading-context"
import { logUserData } from "@/lib/utils"
import { eazynetAPI } from "@/lib/eazynet-api"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"

// Helper function for conditional logging
const log = (message: string, data?: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`AuthForm: ${message}`, data || '')
  }
}

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  })
  
  const { isLoading, withLoading } = useLoading()
  const { updateAuthState } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_]).{8,}$/
    return passwordRegex.test(password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null) // Clear previous errors

    await withLoading('auth-form', async () => {
      // Validation
      if (!validateEmail(formData.email)) {
        setValidationError("Please enter a valid email address")
        return
      }

      if (!validatePassword(formData.password)) {
        setValidationError("Password must be at least 8 characters with uppercase, lowercase, number, and special character")
        return
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        setValidationError("Passwords do not match")
        return
      }

      if (isLogin) {
        // Login
        log('Attempting login for email:', formData.email)
        try {
          const response = await eazynetAPI.login({
            email: formData.email,
            password: formData.password,
          })

          if (response.token) {
            // Check if we have user data in the login response
            if (response.user && response.user.name) {
              const userData = {
                id: response.user.id,
                email: response.user.email,
                name: response.user.name
              }
              
              const sessionData = {
                token: response.token,
                refreshToken: response.refreshToken,
                user: userData
              }
              
              updateAuthState(userData, sessionData)
            } else {
              // For login, we only need to store the token
              // User profile data will be fetched separately when needed
              const sessionData = {
                token: response.token,
                refreshToken: response.refreshToken,
                user: null // We'll fetch user data separately
              }
              
              updateAuthState(null, sessionData)
            }
            
            toast.success("Login successful!")
            // Auth context will handle the redirect automatically
          }
        } catch (error) {
          log('Login exception:', error)
          // Extract the specific error message from the Error object
          const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.'
          setValidationError(errorMessage)
          return
        }
      } else {
        // Sign up
        if (!formData.name.trim()) {
          setValidationError("Please enter your full name")
          return
        }

        log('Attempting signup for email and name:', { email: formData.email, name: formData.name })
        try {
          const response = await eazynetAPI.register({
            email: formData.email,
            password: formData.password,
            name: formData.name,
          })

          if (response.token) {
            // For signup, we might get user data immediately, or we can fetch it later
            if (response.user) {
              const userData = {
                id: response.user.id,
                email: response.user.email,
                name: response.user.name
              }
              
              logUserData('AuthForm', userData, { action: 'Signup Successful', hasSession: true })
              
              const sessionData = {
                token: response.token,
                refreshToken: response.refreshToken,
                user: userData
              }
              updateAuthState(userData, sessionData)
            } else {
              // No user data in response, just store the token
              const sessionData = {
                token: response.token,
                refreshToken: response.refreshToken,
                user: null
              }
              updateAuthState(null, sessionData)
            }
            
            toast.success("Account created successfully!")
            setIsLogin(true)
          }
        } catch (error) {
          log('Signup exception:', error)
          // Extract the specific error message from the Error object
          const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.'
          setValidationError(errorMessage)
          return
        }
      }
    })
  }

  const handleGoogleAuth = async () => {
    setValidationError(null) // Clear previous errors
    await withLoading('google-auth', async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        setValidationError(error.message)
      }
    })
  }

  return (
    <div className="space-y-6">
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

      {/* Toggle Buttons */}
      <div className="flex border rounded-lg p-1 bg-gray-100">
        <Button
          type="button"
          variant={isLogin ? "default" : "ghost"}
          className="flex-1"
          onClick={() => {
            setIsLogin(true)
            setValidationError(null) // Clear errors when switching to login
          }}
          suppressHydrationWarning
        >
          Login
        </Button>
        <Button
          type="button"
          variant={!isLogin ? "default" : "ghost"}
          className="flex-1"
          onClick={() => {
            setIsLogin(false)
            setValidationError(null) // Clear errors when switching to signup
          }}
          suppressHydrationWarning
        >
          Sign Up
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10"
                required={!isLogin}
                suppressHydrationWarning
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10"
              required
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 pr-10"
              required
              suppressHydrationWarning
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
              suppressHydrationWarning
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10"
                required={!isLogin}
                suppressHydrationWarning
              />
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading('auth-form')}
          suppressHydrationWarning
        >
          {isLoading('auth-form') ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleAuth}
        disabled={isLoading('google-auth')}
        suppressHydrationWarning
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {isLoading('google-auth') ? "Connecting..." : "Continue with Google"}
      </Button>

      {isLogin && (
        <div className="text-center">
          <a
            href="#"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              // Add forgot password functionality
              toast.info("Forgot password functionality coming soon!")
            }}
          >
            Forgot your password?
          </a>
        </div>
      )}
    </div>
  )
}