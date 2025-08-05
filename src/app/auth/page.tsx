"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { AuthForm } from "@/components/auth-form"
import { RouteGuard } from "@/components/route-guard"

export default function AuthPage() {
  return (
    <RouteGuard requireGuest>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
        <Navigation />
        <div className="flex flex-col justify-center items-center px-4 py-8 min-h-screen">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-white">Create your EazyNet account</h1>
            <p className="text-white/80 mt-2">Choose how you&apos;d like to sign up. Your tabs will thank you.</p>
          </div>
          
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <AuthForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  )
}