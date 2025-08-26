"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-context"
import { eazynetAPI } from "@/lib/eazynet-api"
import { useUserData } from "@/lib/user-data-context"
import { SubscriptionStatus } from "@/lib/subscription-types"

interface TrialButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children: React.ReactNode
  disabled?: boolean
}

export function TrialButton({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  disabled = false
}: TrialButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { subscription, refreshSubscription } = useUserData()
  const { withLoading } = useLoading()

  // Get subscription status from centralized data
  const subscriptionStatus = subscription ? {
    hasActiveSubscription: subscription.status === SubscriptionStatus.Pro || subscription.status === SubscriptionStatus.Trial,
    isTrialActive: subscription.status === SubscriptionStatus.Trial
  } : null

  // Determine if button should be disabled
  const isDisabled = disabled || isLoading || 
    (subscriptionStatus ? (subscriptionStatus.hasActiveSubscription || subscriptionStatus.isTrialActive) : false)

  // Determine button text based on subscription status
  const getButtonText = () => {
    if (isLoading) return 'Loading...'
    if (subscriptionStatus?.isTrialActive) return 'Trial Active'
    if (subscriptionStatus?.hasActiveSubscription) return 'Already Pro'
    return children
  }

  const handleTrial = async () => {
    if (!user) {
      toast.error('Please sign in to start trial')
      return
    }

    await withLoading('trial', async () => {
      try {
        setIsLoading(true)

        // Call the backend start-trial endpoint
        const updatedUser = await eazynetAPI.startTrial('USD')
        
        // Show success message
        toast.success(`Trial started successfully! You now have Pro access until ${updatedUser.trialEndsAt ? new Date(updatedUser.trialEndsAt).toLocaleDateString() : 'the trial ends'}`)
        
        // Refresh centralized user data to show updated subscription status
        await refreshSubscription()
        
      } catch (error) {
        console.error('Error starting trial:', error)
        
        // Handle specific error cases
        if (error instanceof Error) {
          if (error.message.includes('already has an active trial')) {
            toast.error('You already have an active trial')
          } else if (error.message.includes('already has an active subscription')) {
            toast.error('You already have an active subscription')
          } else {
            toast.error('Failed to start trial. Please try again.')
          }
        } else {
          toast.error('Something went wrong. Please try again.')
        }
      } finally {
        setIsLoading(false)
      }
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleTrial}
      disabled={isDisabled}
    >
      {getButtonText()}
    </Button>
  )
} 