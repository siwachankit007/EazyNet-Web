"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { toast } from "sonner"
import { useLoading } from "@/components/loading-context"
import { UpgradeButton } from "@/components/payment/upgrade-button"
import { SubscriptionStatus, SubscriptionUtils } from "@/lib/subscription-types"
import { useUserData } from "@/lib/user-data-context"

export function SubscriptionManager() {
  const { subscription, isLoading } = useUserData()
  const { withLoading } = useLoading()

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
            You don&apos;t have an active subscription. Upgrade to unlock premium features.
          </p>
          <UpgradeButton showProBadge={false}>
            Upgrade to Pro
          </UpgradeButton>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusInfo = (status: SubscriptionStatus) => {
    return {
      displayName: SubscriptionUtils.getStatusDisplayName(status),
      color: SubscriptionUtils.getStatusColor(status),
      badgeColor: SubscriptionUtils.getStatusBadgeColor(status)
    }
  }

  const statusInfo = getStatusInfo(subscription.status)

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
            <Badge className={statusInfo.badgeColor}>
              {statusInfo.displayName}
            </Badge>
          </div>
          
          {subscription.current_period_start && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Current Period:</span>
              <span className="text-sm">
                {formatDate(subscription.current_period_start)} - {subscription.current_period_end ? formatDate(subscription.current_period_end) : 'Ongoing'}
              </span>
            </div>
          )}
          
          {subscription.is_trial && subscription.trial_ends_at && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Trial Ends:</span>
              <span className="text-sm">{formatDate(subscription.trial_ends_at)}</span>
            </div>
          )}

          {subscription.cancelled_at && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Cancelled:</span>
              <span className="text-sm">{formatDate(subscription.cancelled_at)}</span>
            </div>
          )}

          {subscription.suspended_at && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Suspended:</span>
              <span className="text-sm">{formatDate(subscription.suspended_at)}</span>
            </div>
          )}
          
          {/* Status-specific messages */}
          {subscription.status === SubscriptionStatus.Expired && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                Your subscription has expired. Renew to continue using Pro features.
              </p>
            </div>
          )}

          {subscription.status === SubscriptionStatus.Suspended && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
              <p className="text-sm text-orange-800">
                Your subscription is suspended. Please contact support for assistance.
              </p>
            </div>
          )}

          {subscription.status === SubscriptionStatus.Cancelled && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">
                Your subscription has been cancelled. You can reactivate it below.
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            {SubscriptionUtils.canCancel(subscription.status) && (
              <Button 
                variant="outline" 
                onClick={handleCancelSubscription}
                className="flex-1"
              >
                Cancel Subscription
              </Button>
            )}
            
            {SubscriptionUtils.canReactivate(subscription.status) && (
              <Button 
                onClick={handleReactivateSubscription}
                className="flex-1"
              >
                Reactivate Subscription
              </Button>
            )}

            {subscription.status === SubscriptionStatus.Expired && (
              <UpgradeButton showProBadge={false} className="flex-1">
                Renew Subscription
              </UpgradeButton>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 