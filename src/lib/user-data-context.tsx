"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { eazynetAPI, type SubscriptionSummaryResponse, type ProfileResponse } from '@/lib/eazynet-api'
import { PlanType, SubscriptionUtils, type SubscriptionData, type UserData } from '@/lib/subscription-types'

interface UserDataContextType {
  userData: UserData | null
  subscription: SubscriptionData | null
  isLoading: boolean
  error: string | null
  refreshUserData: () => Promise<void>
  refreshSubscription: () => Promise<void>
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined)

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)
  const [lastSubscriptionFetch, setLastSubscriptionFetch] = useState<number>(0)

  // Cache duration: 5 minutes for profile, 2 minutes for subscription
  const PROFILE_CACHE_DURATION = 5 * 60 * 1000
  const SUBSCRIPTION_CACHE_DURATION = 2 * 60 * 1000

  // Convert backend subscription data to frontend format
  const convertSubscriptionData = useCallback((subscriptionResponse: SubscriptionSummaryResponse, userId: string): SubscriptionData => {
    return {
      id: `sub_${userId}`,
      user_id: userId,
      plan_type: subscriptionResponse.isPro ? PlanType.Pro : PlanType.Free,
      status: SubscriptionUtils.fromNumeric(subscriptionResponse.subscriptionStatus),
      is_trial: subscriptionResponse.isTrialActive,
      trial_ends_at: subscriptionResponse.trialEndsAt || undefined,
      current_period_end: subscriptionResponse.subscriptionExpiresAt || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }, [])

  // Fetch profile data with caching
  const fetchProfileData = useCallback(async (forceRefresh = false): Promise<ProfileResponse | null> => {
    const now = Date.now()
    
    // Check cache unless force refresh
    if (!forceRefresh && lastFetch > 0 && (now - lastFetch) < PROFILE_CACHE_DURATION) {
      return null // Use cached data
    }

    try {
      const profileData = await eazynetAPI.getProfile()
      setLastFetch(now)
      return profileData
    } catch (error) {
      console.error('Error fetching profile data:', error)
      throw error
    }
  }, [lastFetch, PROFILE_CACHE_DURATION])

  // Fetch subscription data with caching
  const fetchSubscriptionData = useCallback(async (forceRefresh = false): Promise<SubscriptionSummaryResponse | null> => {
    const now = Date.now()
    
    // Check cache unless force refresh
    if (!forceRefresh && lastSubscriptionFetch > 0 && (now - lastSubscriptionFetch) < SUBSCRIPTION_CACHE_DURATION) {
      return null // Use cached data
    }

    try {
      const subscriptionData = await eazynetAPI.getSubscription()
      setLastSubscriptionFetch(now)
      return subscriptionData
    } catch (error) {
      console.error('Error fetching subscription data:', error)
      throw error
    }
  }, [lastSubscriptionFetch, SUBSCRIPTION_CACHE_DURATION])

  // Main function to fetch all user data
  const fetchUserData = useCallback(async (forceRefresh = false) => {
    if (!eazynetAPI.isAuthenticated()) {
      setError('User not authenticated')
      setIsLoading(false)
      return
    }

    try {
      setError(null)
      setIsLoading(true)

      // Fetch both profile and subscription data in parallel
      const [profileData, subscriptionData] = await Promise.all([
        fetchProfileData(forceRefresh),
        fetchSubscriptionData(forceRefresh)
      ])

      // Only proceed if we have fresh data
      if (profileData && subscriptionData) {
        const convertedSubscription = convertSubscriptionData(subscriptionData, profileData.id)
        
        // Determine auth method from stored value or default to email
        // Note: JWT issuer check is unreliable since both OAuth and normal users use Supabase
        let authMethod: 'email' | 'oauth' = 'email'
        
        // Try to get auth method from localStorage (set during login)
        const storedAuthMethod = localStorage.getItem('userAuthMethod')
        if (storedAuthMethod === 'oauth' || storedAuthMethod === 'email') {
          authMethod = storedAuthMethod
        }
        
        // TODO: Backend should include authMethod in profile/subscription responses
        // For now, we'll use the stored value from login
        
        const newUserData: UserData = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
          isPro: subscriptionData.isPro,
          isTrial: subscriptionData.isTrialActive,
          createdAt: profileData.createdAt,
          updatedAt: profileData.lastLoginAt || profileData.createdAt,
          subscription: convertedSubscription,
          authMethod: authMethod // Set auth method based on JWT token issuer
        }

        setUserData(newUserData)
        setSubscription(convertedSubscription)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch user data')
    } finally {
      setIsLoading(false)
    }
  }, [fetchProfileData, fetchSubscriptionData, convertSubscriptionData])

  // Refresh functions for components that need fresh data
  const refreshUserData = useCallback(async () => {
    await fetchUserData(true)
  }, [fetchUserData])

  const refreshSubscription = useCallback(async () => {
    await fetchUserData(true)
  }, [fetchUserData])

  // Initial data fetch
  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const value: UserDataContextType = {
    userData,
    subscription,
    isLoading,
    error,
    refreshUserData,
    refreshSubscription
  }

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  )
}

export function useUserData() {
  const context = useContext(UserDataContext)
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider')
  }
  return context
}
