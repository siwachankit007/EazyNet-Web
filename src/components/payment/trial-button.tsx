"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-context"

interface TrialButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children: React.ReactNode
  successUrl?: string
  cancelUrl?: string
}

export function TrialButton({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  successUrl,
  cancelUrl
}: TrialButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { withLoading } = useLoading()

  const handleTrial = async () => {
    if (!user) {
      toast.error('Please sign in to start trial')
      return
    }

    await withLoading('trial', async () => {
      try {
        setIsLoading(true)

        // TODO: Implement trial functionality
        toast.info('Trial functionality coming soon!')
        console.log('Trial requested')
        
        // Placeholder for future trial implementation
        // This will be replaced with actual trial functionality
        
      } catch (error) {
        console.error('Error during trial:', error)
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
      onClick={handleTrial}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : children}
    </Button>
  )
} 