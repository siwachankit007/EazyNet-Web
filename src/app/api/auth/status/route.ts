import { NextRequest, NextResponse } from 'next/server'
import https from 'https'

// Simple JWT decode function (client-side only, no signature validation)
function decodeJWT(token: string) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString())
    return decoded
  } catch (error) {
    console.error('Failed to decode JWT token:', error)
    return null
  }
}

// Function to fetch latest profile data from backend
async function fetchLatestProfile(token: string) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_EAZYNET_API_URL
    
    // For development, use custom HTTPS agent for mkcert certificates
    if (process.env.NODE_ENV === 'development') {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false // Only for development with mkcert
      })
      
      const url = new URL(`${apiBaseUrl}/api/User/profile`)
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        agent: httpsAgent
      }
      
      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = ''
          res.on('data', (chunk) => data += chunk)
          res.on('end', () => {
            if (res.statusCode === 200) {
              try {
                const profileData = JSON.parse(data)
                resolve(profileData)
              } catch {
                reject(new Error('Invalid JSON response'))
              }
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`))
            }
          })
        })
        
        req.on('error', reject)
        req.setTimeout(5000, () => req.destroy())
        req.end()
      })
    } else {
      // Production mode - use standard fetch
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(`${apiBaseUrl}/api/User/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const profileData = await response.json()
        return profileData
      } else {
        const errorText = await response.text()
        console.log('Failed to fetch profile from backend:', response.status, errorText)
        return null
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Profile fetch timed out after 5 seconds')
    } else {
      console.error('Error fetching profile from backend:', error)
    }
    return null
  }
}

// Helper function to set CORS headers
function setCorsHeaders(response: NextResponse, origin: string | null, isChromeExtension: boolean | undefined) {
  if (isChromeExtension) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
}

// Helper function to attempt token refresh
async function attemptTokenRefresh(refreshToken: string): Promise<{ success: boolean; token?: string; expiresAt?: number }> {
  try {
    console.log('Attempting token refresh with refresh token:', refreshToken.substring(0, 20) + '...')
    const apiUrl = process.env.NEXT_PUBLIC_EAZYNET_API_URL
    console.log('Attempting refresh with API URL:', apiUrl)
    
    const refreshRequest = { refreshToken }
    console.log('Sending refresh request:', refreshRequest)
    
    let refreshResponse: Response
    
    // For development, use custom HTTPS agent for mkcert certificates
    if (process.env.NODE_ENV === 'development') {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false // Only for development with mkcert
      })
      
      const url = new URL(`${apiUrl}/api/Auth/refresh`)
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        agent: httpsAgent
      }
      
      refreshResponse = await new Promise<Response>((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = ''
          res.on('data', (chunk) => data += chunk)
          res.on('end', () => {
            // Create a Response-like object
            const response = {
              ok: res.statusCode === 200,
              status: res.statusCode,
              json: async () => JSON.parse(data),
              text: async () => data
            } as Response
            resolve(response)
          })
        })
        
        req.on('error', reject)
        req.setTimeout(5000, () => req.destroy())
        req.write(JSON.stringify(refreshRequest))
        req.end()
      })
    } else {
      // Production mode - use standard fetch
      refreshResponse = await fetch(`${apiUrl}/api/Auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refreshRequest)
      })
    }
    
    console.log('Refresh response status:', refreshResponse.status)
    
    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json()
      console.log('Token refresh successful, response data:', refreshData)
      
      // Handle both direct response and wrapped response formats
      const newToken = refreshData.token || refreshData.data?.token
      const expiresAt = refreshData.expiresAt || refreshData.data?.expiresAt
      
      if (newToken) {
        console.log('Token updated successfully')
        return {
          success: true,
          token: newToken,
          expiresAt: expiresAt ? new Date(expiresAt).getTime() / 1000 : undefined
        }
      } else {
        console.error('No token found in refresh response')
        return { success: false }
      }
    } else {
      const errorText = await refreshResponse.text()
      console.error('Token refresh failed with status:', refreshResponse.status, 'Error:', errorText)
      return { success: false }
    }
  } catch (error) {
    console.error('Token refresh failed:', error)
    return { success: false }
  }
}

export async function GET(request: NextRequest) {
  // Handle CORS for Chrome extension
  const origin = request.headers.get('origin')
  const isChromeExtension = origin?.startsWith('chrome-extension://') || 
                           origin?.startsWith('moz-extension://') ||
                           origin?.includes('chromiumapp.org')

  try {
    // Check for JWT token in Authorization header (for component calls)
    const authHeader = request.headers.get('authorization')
    let jwtToken = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      jwtToken = authHeader.substring(7)
    }
    
    // If no Authorization header, check cookies (for direct browser access)
    if (!jwtToken) {
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=')
          acc[key] = value
          return acc
        }, {} as Record<string, string>)
        
        if (cookies.eazynet_jwt_token) {
          jwtToken = cookies.eazynet_jwt_token
        }
      }
    }
    
    // First, let's check if we have a refresh token available
    let refreshToken = null
    let tokenRefreshed = false
    
    // Parse cookies to get refresh token
    const cookieHeader = request.headers.get('cookie')
    console.log('=== DEBUG: Cookie parsing ===')
    console.log('Raw cookie header:', cookieHeader)
    
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const trimmed = cookie.trim()
        const equalIndex = trimmed.indexOf('=')
        if (equalIndex > 0) {
          const key = trimmed.substring(0, equalIndex)
          const value = trimmed.substring(equalIndex + 1)
          acc[key] = value
        }
        return acc
      }, {} as Record<string, string>)
      
      console.log('All parsed cookies:', Object.keys(cookies))
      console.log('Cookie values:', Object.entries(cookies).map(([k, v]) => `${k}: ${v.substring(0, 20)}...`))
      
      refreshToken = cookies.eazynet_refresh_token
      console.log('Refresh token from cookies:', refreshToken ? refreshToken.substring(0, 20) + '...' : 'null')
    } else {
      console.log('No cookie header found')
    }
    
    if (jwtToken) {
      // Decode JWT token to get basic user info
      const tokenUser = decodeJWT(jwtToken)
      if (tokenUser) {
        // Check if token is expired
        const isExpired = tokenUser.exp && tokenUser.exp < Date.now() / 1000
        
        if (isExpired && refreshToken) {
          // Token is expired, try to refresh using the refresh token
          console.log('JWT token expired, attempting refresh...')
          const refreshResult = await attemptTokenRefresh(refreshToken)
          if (refreshResult.success && refreshResult.token) {
            jwtToken = refreshResult.token
            tokenUser.exp = refreshResult.expiresAt
            tokenRefreshed = true
            console.log('Token refreshed successfully')
          }
        }
        
        // Fetch latest profile data from backend to get accurate isPro status
        const latestProfile = await fetchLatestProfile(jwtToken)
        
        // Use latest profile data if available, fallback to JWT data
        const userData = latestProfile || {
          id: tokenUser.sub || tokenUser.id || 'unknown',
          email: tokenUser.email || 'unknown@email.com',
          name: tokenUser.name || 'User',
          createdAt: tokenUser.iat ? new Date(tokenUser.iat * 1000).toISOString() : new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        }
        
        const response = NextResponse.json({
          authenticated: true,
          user: {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            created_at: userData.createdAt
          },
          isPro: latestProfile ? latestProfile.isPro : false,
          authMethod: 'jwt',
          profileSource: latestProfile ? 'backend' : 'jwt-fallback',
          tokenRefreshed
        })

        setCorsHeaders(response, origin, isChromeExtension)
        return response
      }
    }
    
    // If no JWT token or JWT is invalid, but we have a refresh token, try to refresh
    if (!jwtToken && refreshToken) {
      console.log('=== DEBUG: Attempting refresh without JWT ===')
      console.log('No valid JWT token, but refresh token available. Attempting refresh...')
      const refreshResult = await attemptTokenRefresh(refreshToken)
      console.log('Refresh result:', refreshResult)
      
      if (refreshResult.success && refreshResult.token) {
        console.log('Refresh successful, processing new token...')
        // We got a new token, now decode it and proceed
        const tokenUser = decodeJWT(refreshResult.token)
        console.log('Decoded token user:', tokenUser)
        
        if (tokenUser) {
          // Fetch latest profile data from backend
          const latestProfile = await fetchLatestProfile(refreshResult.token)
          
          const userData = latestProfile || {
            id: tokenUser.sub || tokenUser.id || 'unknown',
            email: tokenUser.email || 'unknown@email.com',
            name: tokenUser.name || 'User',
            createdAt: tokenUser.iat ? new Date(tokenUser.iat * 1000).toISOString() : new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          }
          
          const response = NextResponse.json({
            authenticated: true,
            user: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              created_at: userData.createdAt
            },
            isPro: latestProfile ? latestProfile.isPro : false,
            authMethod: 'jwt',
            profileSource: latestProfile ? 'backend' : 'jwt-fallback',
            tokenRefreshed: true
          })

          setCorsHeaders(response, origin, isChromeExtension)
          return response
        } else {
          console.log('Failed to decode refreshed token')
        }
      } else {
        console.log('Refresh failed or no token returned')
      }
    } else {
      console.log('=== DEBUG: No refresh attempt ===')
      console.log('JWT token exists:', !!jwtToken)
      console.log('Refresh token exists:', !!refreshToken)
    }
    
    // If no token or decoding failed, user is not authenticated
    console.log('=== DEBUG: Final decision ===')
    console.log('No valid authentication found, returning false')
    console.log('JWT token exists:', !!jwtToken)
    console.log('Refresh token exists:', !!refreshToken)
    console.log('Token refreshed:', tokenRefreshed)
    
    const response = NextResponse.json({
      authenticated: false,
      user: null,
      isPro: false
    })

    setCorsHeaders(response, origin, isChromeExtension)
    return response

  } catch (error) {
    console.error('Auth Status API: Unexpected error:', error)
    const response = NextResponse.json({
      authenticated: false,
      user: null,
      isPro: false,
      error: 'Internal server error'
    }, { status: 500 })

    setCorsHeaders(response, origin, isChromeExtension)
    return response
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const isChromeExtension = origin?.startsWith('chrome-extension://') || 
                           origin?.startsWith('moz-extension://') ||
                           origin?.includes('chromiumapp.org')

  const response = new NextResponse(null, { status: 200 })
  setCorsHeaders(response, origin, isChromeExtension)
  return response
} 