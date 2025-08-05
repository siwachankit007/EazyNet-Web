import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { getUserDataWithFallback, invalidateUserCache } from '@/lib/user-utils'

export async function GET(request: NextRequest) {
  // Handle CORS for Chrome extension
  const origin = request.headers.get('origin')
  const isChromeExtension = origin?.startsWith('chrome-extension://') || 
                           origin?.startsWith('moz-extension://') ||
                           origin?.includes('chromiumapp.org')

  const response = NextResponse.json({})

  // Set CORS headers for Chrome extension
  if (isChromeExtension) {
    response.headers.set('Access-Control-Allow-Origin', origin || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  try {
    const supabase = await createClient()
    
    // Get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Auth Status API: Session error:', sessionError)
      return NextResponse.json({
        authenticated: false,
        user: null,
        isPro: false,
        error: 'Session error'
      }, { status: 500 })
    }

    // If no session, user is not authenticated
    if (!session || !session.user) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        isPro: false
      })
    }

    // Get user data including pro status
    // Invalidate cache first to ensure fresh data
    invalidateUserCache(session.user.id)
    
    // Direct database query to get fresh data
    const { data: dbUserData } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()
    
    const userData = await getUserDataWithFallback(session.user, true) // Force refresh
    
    if (!userData) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.user.id,
          email: session.user.email,
          created_at: session.user.created_at
        },
        isPro: false,
        error: 'User data not found'
      })
    }

    // Check both database isPro and user metadata isPro
    const isProFromDatabase = userData.isPro || false
    const isProFromMetadata = session.user.user_metadata?.isPro || false
    const isProFromDirectQuery = dbUserData?.ispro || false
    const finalIsPro = isProFromDirectQuery || isProFromDatabase || isProFromMetadata

    // Return authenticated user with pro status
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        created_at: session.user.created_at,
        name: userData.name,
        isPro: finalIsPro
      },
      isPro: finalIsPro
    })

  } catch (error) {
    console.error('Auth Status API: Unexpected error:', error)
    return NextResponse.json({
      authenticated: false,
      user: null,
      isPro: false,
      error: 'Internal server error'
    }, { status: 500 })
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