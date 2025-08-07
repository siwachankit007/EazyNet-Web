"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-context"

interface SubscriptionData {
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

export function SubscriptionManager() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { withLoading } = useLoading()

  useEffect(() => {
    if (user) {
      fetchSubscription()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const fetchSubscription = async () => {
    if (!user) return

    try {
      // TODO: Implement subscription fetching
      // This will be replaced with actual subscription management
      console.log('Fetching subscription for user:', user.id)
      
      // Placeholder - no subscription data for now
      setSubscription(null)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    await withLoading('cancel-subscription', async () => {
      try {
        // TODO: Implement subscription cancellation
        toast.info('Subscription cancellation coming soon!')
        console.log('Cancelling subscription:', subscription.id)
        
      } catch (error) {
        console.error('Error cancelling subscription:', error)
        toast.error('Something went wrong')
      }
    })
  }

  const handleReactivateSubscription = async () => {
    if (!subscription) return

    await withLoading('reactivate-subscription', async () => {
      try {
        // TODO: Implement subscription reactivation
        toast.info('Subscription reactivation coming soon!')
        console.log('Reactivating subscription:', subscription.id)
        
      } catch (error) {
        console.error('Error reactivating subscription:', error)
        toast.error('Something went wrong')
      }
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Loading subscription details...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>No active subscription found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            You don't have an active subscription. Upgrade to unlock premium features.
          </p>
          <Button>
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600'
      case 'cancelled':
        return 'text-red-600'
      case 'expired':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>Manage your subscription</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Plan:</span>
            <span className="capitalize">{subscription.plan_type}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Status:</span>
            <span className={`capitalize ${getStatusColor(subscription.status)}`}>
              {subscription.status}
            </span>
          </div>
          
          {subscription.current_period_start && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Current Period:</span>
              <span>{formatDate(subscription.current_period_start)} - {subscription.current_period_end ? formatDate(subscription.current_period_end) : 'Ongoing'}</span>
            </div>
          )}
          
          {subscription.is_trial && subscription.trial_ends_at && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Trial Ends:</span>
              <span>{formatDate(subscription.trial_ends_at)}</span>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            {subscription.status === 'active' && (
              <Button 
                variant="outline" 
                onClick={handleCancelSubscription}
                className="flex-1"
              >
                Cancel Subscription
              </Button>
            )}
            
            {subscription.status === 'cancelled' && (
              <Button 
                onClick={handleReactivateSubscription}
                className="flex-1"
              >
                Reactivate Subscription
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 