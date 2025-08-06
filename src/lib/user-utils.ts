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
  createdAt: string
  updatedAt: string
  user_metadata?: Record<string, unknown>
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
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('UserData: Error fetching user data:', error)
      return null
    }

    if (data) {
      const userData: UserData = {
        id: data.id,
        email: data.email,
        name: data.name,
        isPro: Boolean(data.ispro), // Database column is lowercase 'ispro'
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        user_metadata: data.user_metadata
      }

      // Cache the result
      userDataCache.set(userId, {
        data: userData,
        timestamp: Date.now()
      })

      // Only log in development and only if verbose logging is enabled
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_VERBOSE_LOGGING === 'true') {
        logUserData('UserData', { ...data, user_metadata: data.user_metadata }, { 
          action: 'Database Fetch',
          isPro: userData.isPro 
        })
      }

      return userData
    }

    return null
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
    createdAt: sessionUserTyped.created_at || new Date().toISOString(),
    updatedAt: sessionUserTyped.updated_at || new Date().toISOString(),
    user_metadata: sessionUserTyped.user_metadata
  }
} 