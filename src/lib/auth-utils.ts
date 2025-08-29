export interface AuthStatusResponse {
  authenticated: boolean
  user: {
    id: string
    email: string
    name?: string
    created_at: string
    isPro?: boolean
  } | null
  isPro: boolean
  authMethod?: 'jwt'
  error?: string
}

/**
 * Check if a user is an OAuth user based on JWT token
 * OAuth users have 'amr' (authentication methods) that don't include 'pwd' (password)
 */
export function isOAuthUser(token: string): boolean {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    const payload = parts[1]
    if (!payload) return false
    
    const decoded = JSON.parse(atob(payload))
    
    // Check if user has authentication methods (amr) that don't include password
    if (decoded.amr && Array.isArray(decoded.amr)) {
      // If amr doesn't contain 'pwd' (password), it's likely an OAuth user
      return !decoded.amr.some((method: { method: string }) => method.method === 'password')
    }
    
    // Check app_metadata.provider for OAuth indicators
    if (decoded.app_metadata?.provider) {
      return decoded.app_metadata.provider !== 'email'
    }
    
    // Default to false (assume email/password user)
    return false
  } catch (error) {
    console.error('Error checking OAuth status:', error)
    return false
  }
}

/**
 * Get authentication status from the API endpoint
 */
export async function getAuthStatus(): Promise<AuthStatusResponse> {
  try {
    const response = await fetch('/api/auth/status', {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: AuthStatusResponse = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching auth status:', error)
    return {
      authenticated: false,
      user: null,
      isPro: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
} 