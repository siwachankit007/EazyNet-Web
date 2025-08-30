/**
 * Subscription Status Enum - matches backend C# enum implementation
 * 
 * Backend C# enum:
 * public enum SubscriptionStatus
 * {
 *     Free = 1,
 *     Trial = 2,
 *     Pro = 3,
 *     Expired = 4,
 *     Cancelled = 5,
 *     Suspended = 6
 * }
 */
export enum SubscriptionStatus {
  Free = 1,
  Trial = 2,
  Pro = 3,
  Expired = 4,
  Cancelled = 5,
  Suspended = 6
}

/**
 * Plan types for subscriptions
 */
export enum PlanType {
  Free = 'free',
  Trial = 'trial',
  Pro = 'pro'
}

/**
 * Extended subscription data interface using enums
 */
export interface SubscriptionData {
  id: string
  user_id: string
  plan_type: PlanType
  status: SubscriptionStatus
  is_trial: boolean
  trial_started_at?: string
  trial_ends_at?: string
  current_period_start?: string
  current_period_end?: string
  cancelled_at?: string
  suspended_at?: string
  created_at: string
  updated_at: string
}

/**
 * User data interface with subscription
 */
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
  authMethod?: 'email' | 'oauth' // Add auth method flag
}

/**
 * Utility functions for subscription status management
 */
export const SubscriptionUtils = {
  /**
   * Get display name for subscription status
   */
  getStatusDisplayName(status: SubscriptionStatus): string {
    switch (status) {
      case SubscriptionStatus.Free:
        return 'Free'
      case SubscriptionStatus.Trial:
        return 'Trial'
      case SubscriptionStatus.Pro:
        return 'Pro'
      case SubscriptionStatus.Expired:
        return 'Expired'
      case SubscriptionStatus.Cancelled:
        return 'Cancelled'
      case SubscriptionStatus.Suspended:
        return 'Suspended'
      default:
        return 'Unknown'
    }
  },

  /**
   * Get CSS color class for subscription status
   */
  getStatusColor(status: SubscriptionStatus): string {
    switch (status) {
      case SubscriptionStatus.Free:
        return 'text-gray-600'
      case SubscriptionStatus.Trial:
        return 'text-blue-600'
      case SubscriptionStatus.Pro:
        return 'text-green-600'
      case SubscriptionStatus.Expired:
        return 'text-yellow-600'
      case SubscriptionStatus.Cancelled:
        return 'text-red-600'
      case SubscriptionStatus.Suspended:
        return 'text-orange-600'
      default:
        return 'text-gray-600'
    }
  },

  /**
   * Get background color class for subscription status badges
   */
  getStatusBadgeColor(status: SubscriptionStatus): string {
    switch (status) {
      case SubscriptionStatus.Free:
        return 'bg-gray-100 text-gray-800'
      case SubscriptionStatus.Trial:
        return 'bg-blue-100 text-blue-800'
      case SubscriptionStatus.Pro:
        return 'bg-green-100 text-green-800'
      case SubscriptionStatus.Expired:
        return 'bg-yellow-100 text-yellow-800'
      case SubscriptionStatus.Cancelled:
        return 'bg-red-100 text-red-800'
      case SubscriptionStatus.Suspended:
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  },

  /**
   * Check if subscription status allows access to pro features
   */
  isProAccess(status: SubscriptionStatus): boolean {
    return status === SubscriptionStatus.Pro || status === SubscriptionStatus.Trial
  },

  /**
   * Check if subscription status is active (user can use the service)
   */
  isActive(status: SubscriptionStatus): boolean {
    return status !== SubscriptionStatus.Expired && 
           status !== SubscriptionStatus.Cancelled && 
           status !== SubscriptionStatus.Suspended
  },

  /**
   * Check if subscription can be cancelled
   */
  canCancel(status: SubscriptionStatus): boolean {
    return status === SubscriptionStatus.Pro || status === SubscriptionStatus.Trial
  },

  /**
   * Check if subscription can be reactivated
   */
  canReactivate(status: SubscriptionStatus): boolean {
    return status === SubscriptionStatus.Cancelled || 
           status === SubscriptionStatus.Suspended ||
           status === SubscriptionStatus.Expired
  },

  /**
   * Convert backend numeric status to enum
   */
  fromNumeric(numericStatus: number): SubscriptionStatus {
    if (Object.values(SubscriptionStatus).includes(numericStatus as SubscriptionStatus)) {
      return numericStatus as SubscriptionStatus
    }
    return SubscriptionStatus.Free // Default fallback
  },

  /**
   * Convert string status to enum (for legacy compatibility)
   */
  fromString(stringStatus: string): SubscriptionStatus {
    switch (stringStatus.toLowerCase()) {
      case 'free':
        return SubscriptionStatus.Free
      case 'trial':
        return SubscriptionStatus.Trial
      case 'pro':
      case 'active':
        return SubscriptionStatus.Pro
      case 'expired':
        return SubscriptionStatus.Expired
      case 'cancelled':
        return SubscriptionStatus.Cancelled
      case 'suspended':
        return SubscriptionStatus.Suspended
      default:
        return SubscriptionStatus.Free
    }
  }
}
