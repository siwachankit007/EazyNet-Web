import { logUserData } from "@/lib/utils"
import { eazynetAPI, type SubscriptionSummaryResponse } from "@/lib/eazynet-api"
import { SubscriptionStatus, PlanType, SubscriptionUtils, type SubscriptionData, type UserData } from "@/lib/subscription-types"

// Cache for user data to avoid excessive database calls
const userDataCache = new Map<string, { data: UserData; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Fetches user data from database with caching for performance
 * @param userId - The user ID to fetch data for
 * @param forceRefresh - Whether to bypass cache and fetch fresh data
 * @returns Promise<UserData | null>
 */
export async function fetchUserData(userId: string, forceRefresh = false): Promise<UserData | null> {
  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = userDataCache.get(userId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
  }

  try {
    // Check if user is authenticated via EazyNet backend
    if (!eazynetAPI.isAuthenticated()) {
      console.error('UserData: User not authenticated via EazyNet backend')
      return null
    }

    // Fetch user profile and subscription from backend
    const [profileData, subscriptionData] = await Promise.all([
      eazynetAPI.getProfile(),
      eazynetAPI.getSubscription()
    ])

    // Convert backend subscription data to frontend format
    const subscription: SubscriptionData = {
      id: `sub_${userId}`, // Generate a local ID since backend doesn't provide one
      user_id: userId,
      plan_type: subscriptionData.isPro ? PlanType.Pro : PlanType.Free,
      status: SubscriptionUtils.fromNumeric(subscriptionData.subscriptionStatus),
      is_trial: subscriptionData.isTrialActive,
      trial_ends_at: subscriptionData.trialEndsAt || undefined,
      current_period_end: subscriptionData.subscriptionExpiresAt || undefined,
      created_at: new Date().toISOString(), // Backend doesn't provide this
      updated_at: new Date().toISOString()  // Backend doesn't provide this
    }

    const user: UserData = {
      id: profileData.id,
      email: profileData.email,
      name: profileData.name,
      isPro: subscriptionData.isPro,
      isTrial: subscriptionData.isTrialActive,
      createdAt: profileData.createdAt,
      updatedAt: profileData.lastLoginAt,
      subscription
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