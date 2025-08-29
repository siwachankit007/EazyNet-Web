// EazyNet Backend API Client
import { log } from './utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_EAZYNET_API_URL

// Runtime validation with development fallback
const getApiBaseUrl = () => {
  if (!API_BASE_URL) {
    // Development fallback for local testing
    if (process.env.NODE_ENV === 'development') {
      log.warn('NEXT_PUBLIC_EAZYNET_API_URL environment variable is required for production')
      return 'https://localhost:7061'
    }
    throw new Error('NEXT_PUBLIC_EAZYNET_API_URL environment variable is required')
  }
  return API_BASE_URL
}

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  fullName: string
  confirmPassword: string
}

interface AuthResponse {
  token: string
  refreshToken: string
  expiresAt: string
  user: {
    id: string
    email: string
    name: string
    isPro: boolean
    isInterestedInPro: boolean
    isTrial: boolean
    trialEndsAt: string | null
    subscriptionStatus: number
    upgradedFromTrial: boolean
    permanentProSince: string | null
    createdAt: string
    lastLoginAt: string
  }
}

interface OAuthLoginRequest {
  provider: string
  accessToken: string
  idToken?: string
}

interface ProfileResponse {
  id: string
  email: string
  name: string
  isPro: boolean
  createdAt: string
  lastLoginAt: string
}

interface SubscriptionSummaryResponse {
  hasActiveSubscription: boolean
  isTrialActive: boolean
  trialEndsAt: string | null
  subscriptionExpiresAt: string | null
  subscriptionStatus: number
  isPro: boolean
}

interface StartTrialRequest {
  currency: string
}

interface UserDto {
  id: string
  email: string
  name: string
  isPro: boolean
  isInterestedInPro: boolean
  isTrial: boolean
  trialEndsAt: string | null
  subscriptionStatus: number
  upgradedFromTrial: boolean
  permanentProSince: string | null
  createdAt: string
  lastLoginAt: string | null
}

interface ProfileUpdateRequest {
  fullname?: string
  email?: string
}

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

interface ForgotPasswordResponse {
  message: string
}



interface JwtPayload {
  sub?: string
  email?: string
  name?: string
  iat?: number
  exp?: number
  [key: string]: unknown
}

class EazyNetAPI {
  private token: string | null = null
  private refreshToken: string | null = null

  constructor() {
    // Load tokens from localStorage on initialization
    if (typeof window !== 'undefined') {
      try {
        this.token = localStorage.getItem('eazynet_token')
        this.refreshToken = localStorage.getItem('eazynet_refresh_token')
      } catch (error) {
        log.warn('Failed to access localStorage:', error)
        this.token = null
        this.refreshToken = null
      }
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${getApiBaseUrl()}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth header if token exists
    if (this.token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${this.token}`
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        if (response.status === 401 && this.refreshToken) {
          // Try to refresh token
          const refreshed = await this.refreshAuthToken()
          if (refreshed) {
            // Retry the original request
            if (this.token) {
              config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${this.token}`
              }
            }
            const retryResponse = await fetch(url, config)
            if (!retryResponse.ok) {
              // Try to get error details from response body
              let errorData
              try {
                errorData = await retryResponse.json()
              } catch {
                // If JSON parsing fails, try to get text content
                try {
                  const errorText = await retryResponse.text()
                  if (errorText) {
                    throw new Error(errorText)
                  }
                } catch {
                  // If all else fails, fall back to status
                  throw new Error(`HTTP error! status: ${retryResponse.status}`)
                }
              }
              
              // Now handle the parsed error data
              if (errorData) {
                if (errorData.error) {
                  throw new Error(errorData.error)
                } else if (errorData.message) {
                  throw new Error(errorData.message)
                } else if (errorData.errors) {
                  // Handle validation errors more gracefully
                  const errorMessages = Object.values(errorData.errors)
                    .flat()
                    .filter(msg => typeof msg === 'string')
                    .join(', ')
                  throw new Error(errorMessages || `Request failed with status ${retryResponse.status}`)
                } else {
                  throw new Error(`Request failed with status ${retryResponse.status}`)
                }
              }
            }
            return await retryResponse.json()
          }
        }
        
        // Try to get error details from response body for non-401 errors
        let errorData
        try {
          errorData = await response.json()
        } catch {
          // If JSON parsing fails, try to get text content
          try {
            const errorText = await response.text()
            if (errorText) {
              throw new Error(errorText)
            }
          } catch {
            // If all else fails, fall back to status
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        }
        
        // Now handle the parsed error data
        if (errorData) {
          if (errorData.error) {
            throw new Error(errorData.error)
          } else if (errorData.message) {
            throw new Error(errorData.message)
          } else if (errorData.errors) {
            // Handle validation errors more gracefully
            const errorMessages = Object.values(errorData.errors)
              .flat()
              .filter(msg => typeof msg === 'string')
              .join(', ')
            throw new Error(errorMessages || `Request failed with status ${response.status}`)
          } else {
            throw new Error(`Request failed with status ${response.status}`)
          }
        }
      }

      return await response.json()
    } catch (error) {
      log.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/api/Auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })

    this.setTokens(response.token, response.refreshToken)

    return response
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/api/Auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })

    this.setTokens(response.token, response.refreshToken)

    return response
  }

  async oauthLogin(oauthData: OAuthLoginRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<AuthResponse>('/api/Auth/oauth-login', {
      method: 'POST',
      body: JSON.stringify(oauthData)
    })

    this.setTokens(response.token, response.refreshToken)

    return response
  }

  async refreshAuthToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false
    }
  
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/Auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      })
  
      if (response.ok) {
        const data = await response.json()
        if (data.token && data.refreshToken) {
          this.setTokens(data.token, data.refreshToken)
          return true
        }
      }
    } catch (error) {
      log.error('Token refresh failed:', error)
    }
  
    // Only clear all tokens if refresh completely fails
    this.clearAllTokens() // Use clearAllTokens instead of clearTokens
    return false
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await this.makeRequest('/api/Auth/logout', {
          method: 'POST'
        })
      }
    } catch (error) {
      log.error('Logout failed:', error)
    } finally {
      this.clearAllTokens() // Logout should clear everything
    }
  }

  // User endpoints
  async getProfile(): Promise<ProfileResponse> {
    const response = await this.makeRequest<ProfileResponse>('/api/User/profile')
    return response
  }

  async updateProfile(profileData: ProfileUpdateRequest): Promise<ProfileResponse> {
    return await this.makeRequest<ProfileResponse>('/api/User/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<UserDto> {
    return await this.makeRequest<UserDto>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    })
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return await this.makeRequest<ForgotPasswordResponse>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
  }



  async getSubscription(): Promise<SubscriptionSummaryResponse> {
    const response = await this.makeRequest<SubscriptionSummaryResponse>('/api/User/subscription')
    return response
  }

  async startTrial(currency: string = 'USD'): Promise<UserDto> {
    const response = await this.makeRequest<UserDto>('/api/User/start-trial', {
      method: 'POST',
      body: JSON.stringify({ currency })
    })
    return response
  }

  // Waitlist endpoint
  async updateInterestedInProFlag(value: boolean): Promise<boolean> {
    const response = await this.makeRequest<boolean>(`/api/User/profile/interested-in-pro?value=${value}`, {
      method: 'PATCH'
    })
    return response
  }

  // Token management
  private setTokens(token: string, refreshToken: string) {
    this.token = token
    this.refreshToken = refreshToken
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('eazynet_token', token)
      localStorage.setItem('eazynet_refresh_token', refreshToken)
      
      // Also set cookies for server-side access
      const expires = new Date()
      expires.setDate(expires.getDate() + 7)
      document.cookie = `eazynet_jwt_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
      
      // Set refresh token cookie for server-side token refresh
      const refreshExpires = new Date()
      refreshExpires.setDate(refreshExpires.getDate() + 30) // 30 days for refresh token
      const refreshCookie = `eazynet_refresh_token=${refreshToken}; expires=${refreshExpires.toUTCString()}; path=/; SameSite=Lax`
      document.cookie = refreshCookie
      console.log('Set refresh token cookie:', refreshCookie.substring(0, 50) + '...')
    }
  }

  // Clear only access token (keep refresh token for auto-refresh)
private clearAccessToken() {
  this.token = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem('eazynet_token')
    // Keep refresh token in localStorage
  }
}

// Clear everything (for logout, security issues, etc.)
private clearAllTokens() {
  this.token = null
  this.refreshToken = null
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('eazynet_token')
    localStorage.removeItem('eazynet_refresh_token')
    document.cookie = 'eazynet_jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'eazynet_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
}

// Update the existing clearTokens method
private clearTokens() {
  // Only clear access token, keep refresh token for auto-refresh
  this.clearAccessToken()
}

  // Getters
  getToken(): string | null {
    return this.token
  }

  getRefreshToken(): string | null {
    return this.refreshToken
  }

  // Method to refresh token state from localStorage
  refreshTokenState(): void {
    if (typeof window !== 'undefined') {
      try {
        this.token = localStorage.getItem('eazynet_token')
        this.refreshToken = localStorage.getItem('eazynet_refresh_token')
      } catch (error) {
        log.warn('Failed to refresh token state from localStorage:', error)
      }
    }
  }

  isAuthenticated(): boolean {
    if (!this.token) return false
    
          // Validate token format before considering it valid
      try {
        const parts = this.token.split('.')
        if (parts.length !== 3) {
          log.warn('Invalid JWT format detected, clearing access token only')
          this.clearTokens() // Keep refresh token for auto-refresh
          return false
        }
      
      // Check if token is expired (basic check)
      const payload = parts[1]
      if (payload) {
        const decoded = JSON.parse(atob(payload))
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
          log.warn('Token expired, clearing access token only')
          this.clearTokens() // Keep refresh token for auto-refresh
          return false
        }
      }
      
      return true
          } catch (error) {
        log.warn('Token validation failed, clearing access token only:', error)
        this.clearTokens() // Keep refresh token for auto-refresh
        return false
      }
  }

  // Get user data from token (basic JWT decode)
  getUserFromToken(): JwtPayload | null {
    if (!this.token) return null
    
    try {
      // Check if token has valid JWT format (3 parts separated by dots)
      const parts = this.token.split('.')
      if (parts.length !== 3) {
        log.warn('Invalid JWT format: token does not have 3 parts')
        this.clearTokens() // Keep refresh token for auto-refresh
        return null
      }
      
      const payload = parts[1]
      if (!payload) {
        log.warn('Invalid JWT format: missing payload')
        return null
      }
      
      // Try to decode the payload
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (error) {
      log.error('Failed to decode token:', error)
      // Clear the invalid token but keep refresh token
      this.clearTokens() // Keep refresh token for auto-refresh
      return null
    }
  }
}

// Create and export a singleton instance
export const eazynetAPI = new EazyNetAPI()

// Export types for use in other files
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ProfileResponse,
  ProfileUpdateRequest,
  ChangePasswordRequest,
  SubscriptionSummaryResponse,
  StartTrialRequest,
  UserDto,
  JwtPayload
}
