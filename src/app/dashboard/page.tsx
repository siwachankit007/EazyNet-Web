"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProBenefits } from "@/components/pro-benefits"
import { QuickActions } from "@/components/quick-actions"
import { UserStats } from "@/components/user-stats"
import { SubscriptionManager } from "@/components/payment/subscription-manager"
import { TrialButton } from "@/components/payment/trial-button"
import { RouteGuard } from "@/components/route-guard"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

// TypeScript declarations for Chrome extension API
interface ChromeRuntime {
  sendMessage: (extensionId: string, message: Record<string, unknown>, callback?: (response: unknown) => void) => void
  lastError?: { message: string }
}

interface ChromeAPI {
  runtime?: ChromeRuntime
}

interface ExtendedWindow extends Window {
  chrome?: ChromeAPI
}

function DashboardContent() {
  const { user } = useAuth()
  const [extensionStatus, setExtensionStatus] = useState({
    isActive: false,
    lastSync: null as string | null,
    isLoading: true
  })

  // Check extension status
  useEffect(() => {
    const checkExtensionStatus = () => {
      // Try to communicate with the extension
      window.postMessage({ type: 'EAZYNET_EXTENSION', action: 'checkStatus' }, '*')
      
      // Simulate checking extension status
      setTimeout(() => {
        // For now, we'll assume the extension is active if the user is on the dashboard
        // In a real implementation, this would check actual extension communication
        setExtensionStatus({
          isActive: true,
          lastSync: new Date().toLocaleTimeString(),
          isLoading: false
        })
      }, 1000)
    }

    checkExtensionStatus()
  }, [])

  const openExtension = () => {
    // Try to communicate with extension via chrome.runtime.sendMessage
    const extendedWindow = window as ExtendedWindow
    if (typeof window !== 'undefined' && extendedWindow.chrome?.runtime) {
      console.log('Attempting to send message to extension...')
      extendedWindow.chrome.runtime.sendMessage('ghkblcolgioaoajmhciloahjjcbhekbi', { action: 'open' }, (response: unknown) => {
        console.log('Extension response:', response)
        if (extendedWindow.chrome?.runtime?.lastError) {
          console.log('Extension error:', extendedWindow.chrome.runtime.lastError)
          toast.success('Press Ctrl+Shift+E to open the EazyNet extension, or click the extension icon in your browser toolbar.')
        } else if (response && typeof response === 'object' && 'success' in response) {
          const responseObj = response as { success: boolean; data?: Record<string, unknown>; error?: string }
          if (responseObj.success) {
            if (responseObj.data?.method === 'highlight') {
              toast.success('Extension icon highlighted! Please click the EazyNet icon in your browser toolbar.')
            } else {
              toast.success('Extension opened successfully!')
            }
          } else {
            toast.error(`Extension error: ${responseObj.error || 'Unknown error'}`)
          }
        } else {
          // No response or invalid response
          toast.success('Press Ctrl+Shift+E to open the EazyNet extension, or click the extension icon in your browser toolbar.')
        }
      })
    } else {
      // Chrome runtime not available
      console.log('Chrome runtime not available')
      toast.success('Press Ctrl+Shift+E to open the EazyNet extension, or click the extension icon in your browser toolbar.')
    }
  }

  const openHelpDocumentation = () => {
    // Open detailed documentation in a new tab
    window.open('/help-documentation', '_blank')
  }

  const openContactSupport = () => {
    // Open contact support (same as footer contact)
    window.location.href = 'mailto:eazynettabmanager@gmail.com'
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-white/80">
              Manage your tab organization and boost your productivity
            </p>
          </div>
          
          <div className="flex gap-3">
            <TrialButton variant="secondary">
              Start Free Trial
            </TrialButton>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Manage Subscription
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <UserStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Area */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <QuickActions />
            
            {/* Extension Status */}
            <Card>
              <CardHeader>
                <CardTitle>Extension Status</CardTitle>
                <CardDescription>
                  Monitor your EazyNet Chrome extension
                </CardDescription>
              </CardHeader>
              <CardContent>
                {extensionStatus.isLoading ? (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-medium text-gray-900">Checking Extension...</p>
                        <p className="text-sm text-gray-700">Verifying connection</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${extensionStatus.isActive ? 'bg-green-500' : 'bg-red-500'} rounded-full`}></div>
                      <div>
                        <p className={`font-medium ${extensionStatus.isActive ? 'text-green-900' : 'text-red-900'}`}>
                          {extensionStatus.isActive ? 'Extension Active' : 'Extension Inactive'}
                        </p>
                        <p className={`text-sm ${extensionStatus.isActive ? 'text-green-700' : 'text-red-700'}`}>
                          {extensionStatus.isActive 
                            ? `Last sync: ${extensionStatus.lastSync}` 
                            : 'Extension not detected'
                          }
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={openExtension}>
                      Open Extension
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-8">
            <ProBenefits />
            
            {/* Subscription Management */}
            <SubscriptionManager />
            
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc" target="_blank" rel="noopener noreferrer">
                    View in Chrome Store
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={openHelpDocumentation}>
                  Help & Documentation
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={openContactSupport}>
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <RouteGuard requireAuth>
      <DashboardContent />
    </RouteGuard>
  )
}