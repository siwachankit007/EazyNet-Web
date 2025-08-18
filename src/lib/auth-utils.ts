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