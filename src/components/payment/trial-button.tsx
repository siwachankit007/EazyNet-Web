"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-context"
import { eazynetAPI } from "@/lib/eazynet-api"

interface TrialButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children: React.ReactNode
  disabled?: boolean
  showSubscriptionStatus?: boolean
}

export function TrialButton({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  disabled = false,
  showSubscriptionStatus = false
}: TrialButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    hasActiveSubscription: boolean
    isTrialActive: boolean
  } | null>(null)
  const { user } = useAuth()
  const { withLoading } = useLoading()

  // Check subscription status when component mounts
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!user || !showSubscriptionStatus) return
      
      try {
        const subscription = await eazynetAPI.getSubscription()
        setSubscriptionStatus({
          hasActiveSubscription: subscription.hasActiveSubscription,
          isTrialActive: subscription.isTrialActive
        })
      } catch (error) {
        console.error('Error checking subscription status:', error)
      }
    }

    checkSubscriptionStatus()
  }, [user, showSubscriptionStatus])

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
        
        // Refresh the page to show updated subscription status
        // This is a simple approach - in a more sophisticated app, you might update the auth context
        window.location.reload()
        
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