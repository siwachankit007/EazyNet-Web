import { createClient } from "@/lib/supabase/client"
import { logUserData } from "@/lib/utils"

// Cache for user data to avoid excessive database calls
const userDataCache = new Map<string, { data: UserData; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export interface UserData {
  id: string
  email: string
  name?: string
  isPro: boolean
  isTrial?: boolean
  createdAt: string
  updatedAt: string
  user_metadata?: Record<string, unknown>
  subscription?: SubscriptionData
}

export interface SubscriptionData {
  id: string
  user_id: string
  plan_type: 'trial' | 'pro'
  status: 'active' | 'cancelled' | 'expired' | 'authenticated' | 'created'
  is_trial: boolean
  trial_started_at?: string
  trial_ends_at?: string
  current_period_start?: string
  current_period_end?: string
  cancelled_at?: string
  created_at: string
  updated_at: string
}

/**
 * Fetches user data from database with caching for performance
 * @param userId - The user ID to fetch data for
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 * @returns Promise<UserData | null>
 */
export async function fetchUserData(userId: string, forceRefresh = false): Promise<UserData | null> {
  const supabase = createClient()
  
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = userDataCache.get(userId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
  }

  try {
    // Fetch user data from auth.users and profiles
    const [authResult, profileResult] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
    ])

    if (authResult.error) {
      console.error('UserData: Error fetching auth user:', authResult.error)
      return null
    }

    const authUser = authResult.data.user
    if (!authUser) {
      console.error('UserData: No auth user found')
      return null
    }

    // Fetch active subscription for the user
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('UserData: Error fetching subscription data:', subscriptionError)
    }

    const user: UserData = {
      id: authUser.id,
      email: authUser.email || '',
      name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || '',
      isPro: Boolean(subscriptionData?.plan_type === 'pro' || subscriptionData?.plan_type === 'trial'),
      isTrial: Boolean(subscriptionData?.is_trial),
      createdAt: authUser.created_at || new Date().toISOString(),
      updatedAt: profileResult?.data?.updated_at || authUser.updated_at || new Date().toISOString(),
      user_metadata: profileResult?.data?.preferences || authUser.user_metadata,
      subscription: subscriptionData || undefined
    }

    // Cache the result
    userDataCache.set(userId, {
      data: user,
      timestamp: Date.now()
    })

    // Only log in development and only if verbose logging is enabled
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_VERBOSE_LOGGING === 'true') {
      logUserData('UserData', { ...user, user_metadata: user.user_metadata }, { 
        action: 'Database Fetch',
        isPro: user.isPro,
        hasSubscription: !!subscriptionData
      })
    }

    return user
  } catch (error) {
    console.error('UserData: Exception fetching user data:', error)
    return null
  }
}

/**
 * Invalidates the cache for a specific user
 * @param userId - The user ID to invalidate cache for
 */
export function invalidateUserCache(userId: string) {
  // Only log in development and only if verbose logging is enabled
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_VERBOSE_LOGGING === 'true') {
    console.log('UserData: Cache invalidated for user:', userId)
  }
  userDataCache.delete(userId)
}

/**
 * Clears all user data cache
 */
export function clearUserCache() {
  if (process.env.NODE_ENV === 'development') {
    console.log('UserData: All cache cleared')
  }
  userDataCache.clear()
}

/**
 * Merges session user data with fresh database data
 * @param sessionUser - User data from session
 * @param forceRefresh - Whether to force refresh from database
 * @returns Promise<UserData | null>
 */
export async function getUserDataWithFallback(sessionUser: { [key: string]: unknown } | null | { id: string; email?: string; user_metadata?: unknown }, forceRefresh = false): Promise<UserData | null> {
  if (!sessionUser?.id) {
    if (process.env.NODE_ENV === 'development') {
      console.log('UserData: No session user ID provided')
    }
    return null
  }

  // Try to get fresh data from database
  const dbData = await fetchUserData(sessionUser.id as string, forceRefresh)
  
  if (dbData) {
    return dbData
  }

  // Fallback to session data if database fetch fails
  if (process.env.NODE_ENV === 'development') {
    console.log('UserData: Falling back to session data for user:', sessionUser.id)
  }
  
  const sessionUserTyped = sessionUser as { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string; updated_at?: string }
  
  return {
    id: sessionUserTyped.id,
    email: sessionUserTyped.email || '',
    name: sessionUserTyped.user_metadata?.name as string | undefined,
    isPro: Boolean(sessionUserTyped.user_metadata?.isPro),
    isTrial: Boolean(sessionUserTyped.user_metadata?.isTrial),
    createdAt: sessionUserTyped.created_at || new Date().toISOString(),
    updatedAt: sessionUserTyped.updated_at || new Date().toISOString(),
    user_metadata: sessionUserTyped.user_metadata
  }
} 