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
    const apiBaseUrl = process.env.NEXT_PUBLIC_EAZYNET_API_URL || 'https://localhost:7061'
    
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
    
    if (jwtToken) {
      // Decode JWT token to get basic user info
      const tokenUser = decodeJWT(jwtToken)
      if (tokenUser) {
        // Check if token is expired
        const isExpired = tokenUser.exp && tokenUser.exp < Date.now() / 1000
        let refreshToken = null
        let tokenRefreshed = false
        
        if (isExpired) {
          // Token is expired, try to refresh using the refresh token from cookies
          const cookieHeader = request.headers.get('cookie')
          
          if (cookieHeader) {
            const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
              const [key, value] = cookie.trim().split('=')
              acc[key] = value
              return acc
            }, {} as Record<string, string>)
            
            refreshToken = cookies.eazynet_refresh_token
          }
          
          if (refreshToken) {
            try {
              // Attempt to refresh the token
              const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_EAZYNET_API_URL}/api/Auth/refresh`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
              })
              
              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json()
                // Use the new token for profile fetch
                jwtToken = refreshData.token
                tokenUser.exp = refreshData.expiresAt ? new Date(refreshData.expiresAt).getTime() / 1000 : undefined
                tokenRefreshed = true
              }
            } catch (error) {
              console.error('Token refresh failed:', error)
            }
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
    
    // If no token or decoding failed, user is not authenticated
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