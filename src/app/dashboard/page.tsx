"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProBenefits } from "@/components/pro-benefits"
import { QuickActions } from "@/components/quick-actions"
import { UserStats } from "@/components/user-stats"
import { createClient } from "@/lib/supabase/client"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { User } from "@supabase/supabase-js"

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  // Fetch user data on component mount
  React.useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      }
    }
    getUser()
  }, [supabase.auth])



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
            <Button variant="secondary">
              Start Free Trial
            </Button>
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
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-green-900">Extension Active</p>
                      <p className="text-sm text-green-700">Last sync: 2 minutes ago</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Open Extension
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-8">
            <ProBenefits />
            
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
                <Button variant="ghost" className="w-full justify-start">
                  Help & Documentation
                </Button>
                <Button variant="ghost" className="w-full justify-start">
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
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}