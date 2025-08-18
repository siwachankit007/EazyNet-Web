// EazyNet Backend API Client
const API_BASE_URL = process.env.NEXT_PUBLIC_EAZYNET_API_URL

// Validate required environment variables
if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_EAZYNET_API_URL environment variable is required')
}

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  email: string
  password: string
  name: string
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
    createdAt: string
    lastLoginAt: string
  }
}

interface ProfileResponse {
  id: string
  email: string
  name: string
  isPro: boolean
  createdAt: string
  lastLoginAt: string
}

interface ProfileUpdateRequest {
  fullname?: string
  email?: string
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
      this.token = localStorage.getItem('eazynet_token')
      this.refreshToken = localStorage.getItem('eazynet_refresh_token')
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
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
          } else {
            throw new Error(`Request failed with status ${response.status}`)
          }
        }
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
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

  async refreshAuthToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/Auth/refresh`, {
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
      console.error('Token refresh failed:', error)
    }

    // Clear tokens if refresh failed
    this.clearTokens()
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
      console.error('Logout failed:', error)
    } finally {
      this.clearTokens()
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

  // Token management
  private setTokens(token: string, refreshToken: string) {
    this.token = token
    this.refreshToken = refreshToken
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('eazynet_token', token)
      localStorage.setItem('eazynet_refresh_token', refreshToken)
      
      // Also set cookie for server-side access
      const expires = new Date()
      expires.setDate(expires.getDate() + 7)
      document.cookie = `eazynet_jwt_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    }
  }

  private clearTokens() {
    this.token = null
    this.refreshToken = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eazynet_token')
      localStorage.removeItem('eazynet_refresh_token')
      
      // Also clear the cookie
      document.cookie = 'eazynet_jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
  }

  // Getters
  getToken(): string | null {
    return this.token
  }

  getRefreshToken(): string | null {
    return this.refreshToken
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  // Get user data from token (basic JWT decode)
  getUserFromToken(): JwtPayload | null {
    if (!this.token) return null
    
    try {
      const payload = this.token.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (error) {
      console.error('Failed to decode token:', error)
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
  JwtPayload
}
