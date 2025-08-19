import { NextRequest, NextResponse } from 'next/server'

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
      // Decode JWT token to get user info
      const tokenUser = decodeJWT(jwtToken)
      if (tokenUser) {
        const response = NextResponse.json({
          authenticated: true,
          user: {
            id: tokenUser.sub || tokenUser.id || 'unknown',
            email: tokenUser.email || 'unknown@email.com',
            name: tokenUser.name || 'User',
            created_at: tokenUser.iat ? new Date(tokenUser.iat * 1000).toISOString() : new Date().toISOString()
          },
          isPro: tokenUser.isPro || false,
          authMethod: 'jwt'
        })

        // Set CORS headers for Chrome extensions
        if (isChromeExtension) {
          response.headers.set('Access-Control-Allow-Origin', origin || '*')
          response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
          response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
          response.headers.set('Access-Control-Allow-Credentials', 'true')
        }

        return response
      }
    }
    
    // If no token or decoding failed, user is not authenticated
    const response = NextResponse.json({
      authenticated: false,
      user: null,
      isPro: false
    })

    // Set CORS headers for Chrome extensions
    if (isChromeExtension) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }

    return response

  } catch (error) {
    console.error('Auth Status API: Unexpected error:', error)
    const response = NextResponse.json({
      authenticated: false,
      user: null,
      isPro: false,
      error: 'Internal server error'
    }, { status: 500 })

    // Set CORS headers for Chrome extensions
    if (isChromeExtension) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }

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

  if (isChromeExtension) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  return response
} 