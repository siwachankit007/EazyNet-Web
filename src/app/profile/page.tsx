"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-context"
import { AuthGuard } from "@/components/auth-guard"
import type { User } from "@supabase/supabase-js"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function ProfileContent() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()
  const supabase = createClient()
  const { withLoading } = useLoading()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        setFullName(session.user.user_metadata?.name || "")
        setEmail(session.user.email || "")
      }
    }
    getUser()
  }, [supabase.auth])

  const handleUpdateProfile = async () => {
    await withLoading('update-profile', async () => {
      // Update both auth metadata and database table
      const [authResult, dbResult] = await Promise.all([
        supabase.auth.updateUser({
          data: { name: fullName }
        }),
        supabase
          .from('users')
          .update({ 
            name: fullName,
            updated_at: new Date().toISOString()
          })
          .eq('id', user?.id)
      ])

      if (authResult.error || dbResult.error) {
        toast.error("Failed to update profile")
        console.error('Auth error:', authResult.error)
        console.error('DB error:', dbResult.error)
      } else {
        toast.success("Profile updated successfully")
        setIsEditing(false)
        // Refresh session data
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          setFullName(session.user.user_metadata?.name || "")
        }
      }
    })
  }

  const handleSignOut = async () => {
    await withLoading('sign-out', async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error("Error signing out")
      } else {
        toast.success("Signed out successfully")
        // Use direct router push to avoid loading conflicts with auth guard
        router.push('/auth')
      }
    })
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    // Password complexity validation
    const hasMinLength = newPassword.length >= 8
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
    const hasNumber = /\d/.test(newPassword)
    const hasAlphabet = /[a-zA-Z]/.test(newPassword)

    if (!hasMinLength) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    if (!hasSpecialChar) {
      toast.error("Password must contain at least one special character")
      return
    }

    if (!hasNumber) {
      toast.error("Password must contain at least one number")
      return
    }

    if (!hasAlphabet) {
      toast.error("Password must contain at least one letter")
      return
    }

    await withLoading('change-password', async () => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        toast.error("Failed to change password")
        console.error('Password change error:', error)
      } else {
        toast.success("Password changed successfully")
        setIsPasswordDialogOpen(false)
        setNewPassword("")
        setConfirmPassword("")
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-white/80">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={email}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button onClick={handleUpdateProfile}>
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">Two-Factor Authentication</p>
                    <p className="text-sm text-green-700">Add an extra layer of security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div> */}
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">Change Password</p>
                    <p className="text-sm text-blue-700">Update your account password</p>
                  </div>
                  <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your new password below. Password must be at least 8 characters with one letter, one number, and one special character.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-3 pt-4">
                          <Button onClick={handleChangePassword} className="flex-1">
                            Change Password
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsPasswordDialogOpen(false)
                              setNewPassword("")
                              setConfirmPassword("")
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
             {/* Subscription Management */}
             <Card>
               <CardHeader>
                 <CardTitle>Subscription</CardTitle>
                 <CardDescription>
                   Manage your trial and subscription
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-3">
                 <Button className="w-full">
                   Start Trial
                 </Button>
                 <Button variant="outline" className="w-full">
                   Manage Subscription
                 </Button>
               </CardContent>
             </Card>
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="font-medium">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Sign In</span>
                    <span className="font-medium">
                      {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          

                         {/* Quick Actions */}
             <Card>
               <CardHeader>
                 <CardTitle>Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                 <Button variant="ghost" className="w-full justify-start" asChild>
                   <a href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc" target="_blank" rel="noopener noreferrer">
                     View Extension
                   </a>
                 </Button>
                 <Button variant="ghost" className="w-full justify-start">
                   Help & Support
                 </Button>
                 <Button variant="ghost" className="w-full justify-start">
                   Privacy Policy
                 </Button>
                 <Button variant="ghost" className="w-full justify-start">
                   Terms of Service
                 </Button>
               </CardContent>
             </Card>

          
            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Leaving EazyNet?</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
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

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
} 