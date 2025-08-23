"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, CreditCard, Clock, CheckCircle } from "lucide-react"
import { eazynetAPI } from "@/lib/eazynet-api"

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
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const { user } = useAuth()

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade')
      return
    }

    setShowPaymentDialog(true)
  }

  const handleContactSales = () => {
    if (!user) return
    
    // Open email client with pre-filled message
    const subject = encodeURIComponent('EazyNet Pro Upgrade Request')
    const userName = 'name' in user ? user.name : user.email?.split('@')[0] || 'User'
    const body = encodeURIComponent(`Hi EazyNet Team,\n\nI'm interested in upgrading to EazyNet Pro.\n\nUser: ${user.email}\nPlan: ${planType}\n\nPlease provide more information about pricing and features.\n\nBest regards,\n${userName}`)
    
    window.open(`mailto:eazynettabmanager@gmail.com?subject=${subject}&body=${body}`, '_blank')
    setShowPaymentDialog(false)
    toast.success('Email client opened. Please send your upgrade request.')
  }

  const handleJoinWaitlist = async () => {
    if (!user) {
      toast.error('Please sign in to join the waitlist')
      return
    }

    setIsLoading(true)
    try {
      await eazynetAPI.updateInterestedInProFlag(true)
      toast.success('Added to upgrade waitlist! We\'ll notify you when payments are available.')
      setShowPaymentDialog(false)
    } catch (error) {
      toast.error('Failed to join waitlist. Please try again later.')
      console.error('Waitlist error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleUpgrade}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : children}
      </Button>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Upgrade to EazyNet Pro
            </DialogTitle>
            <DialogDescription>
              Get access to advanced features and unlimited tab management
            </DialogDescription>
          </DialogHeader>

                     <div className="space-y-3">
                         {/* Current Status */}
             <Card className="bg-blue-50 border-blue-200">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
                   <Clock className="h-4 w-4" />
                   Payment Integration Status
                 </CardTitle>
               </CardHeader>
               <CardContent className="pt-0">
                 <div className="flex items-center gap-2">
                   <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                     Coming Soon
                   </Badge>
                   <span className="text-sm text-blue-700">
                     Payment gateway integration is in development
                   </span>
                 </div>
               </CardContent>
             </Card>

                         {/* Pro Features Preview */}
             <Card>
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm">Pro Features You will Get</CardTitle>
               </CardHeader>
               <CardContent className="pt-0 space-y-1.5">
                 <div className="flex items-center gap-2 text-sm">
                   <CheckCircle className="h-4 w-4 text-green-600" />
                   <span>AI assistant & Unlimited tab groups</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm">
                   <CheckCircle className="h-4 w-4 text-green-600" />
                   <span>Advanced session and memory management</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm">
                   <CheckCircle className="h-4 w-4 text-green-600" />
                   <span>Priority support</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm">
                   <CheckCircle className="h-4 w-4 text-green-600" />
                   <span>Advanced subgrouping & auto grouping</span>
                 </div>
               </CardContent>
             </Card>

                         {/* Action Buttons */}
             <div className="flex flex-col gap-2">
              <Button 
                onClick={handleContactSales}
                className="w-full"
                variant="default"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Sales Team
              </Button>
              
              <Button 
                onClick={handleJoinWaitlist}
                className="w-full"
                variant="outline"
                disabled={isLoading}
              >
                {isLoading ? 'Joining...' : 'Join Waitlist'}
              </Button>
              
              <Button 
                onClick={() => setShowPaymentDialog(false)}
                className="w-full"
                variant="ghost"
              >
                Maybe Later
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-center text-xs text-gray-500">
              <p>Have questions? Email us at{' '}
                <a 
                  href="mailto:eazynettabmanager@gmail.com" 
                  className="text-blue-600 hover:underline"
                >
                  eazynettabmanager@gmail.com
                </a>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 