"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-context"

interface UpgradeButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  planType?: 'trial' | 'pro'
  children: React.ReactNode
  successUrl?: string
  cancelUrl?: string
}

export function UpgradeButton({
  variant = 'default',
  size = 'default',
  className = '',
  planType = 'pro',
  children
}: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { withLoading } = useLoading()

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade')
      return
    }

    await withLoading('upgrade', async () => {
      try {
        setIsLoading(true)
        
        // TODO: Implement payment gateway integration
        toast.info('Payment integration coming soon!')
        console.log('Upgrade requested for plan:', planType)
        
        // Placeholder for future payment gateway implementation
        // This will be replaced with actual payment gateway integration
        
      } catch (error) {
        console.error('Error during upgrade:', error)
        toast.error('Something went wrong. Please try again.')
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
      onClick={handleUpgrade}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : children}
    </Button>
  )
} 