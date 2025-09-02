"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubscriptionManager } from "@/components/payment/subscription-manager"
import { TrialButton } from "@/components/payment/trial-button"
import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-context"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/lib/auth-context"
import { useUserData } from "@/lib/user-data-context"
import { log } from "@/lib/utils"
import { eazynetAPI } from "@/lib/eazynet-api"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"



function ProfileContent() {
  const { user, fetchUserProfile } = useAuth()
  const { userData, refreshUserData } = useUserData()
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { withLoading } = useLoading()

  // Check if user is OAuth user using the authMethod from user data context
  const isOAuthUser = useMemo(() => {
    // Use userData from user data context (has proper authMethod)
    if (userData?.authMethod) {
      return userData.authMethod === 'oauth'
    }
    
    // Fallback: Check auth context user
    if (user) {
      // Use the simple authMethod flag if available (only for EazyNetUser)
      if ('authMethod' in user) {
        const eazyNetUser = user as { authMethod?: string }
        if (eazyNetUser.authMethod) {
          return eazyNetUser.authMethod === 'oauth'
        }
      }
      
      // Fallback: For Supabase OAuth users, check app_metadata
      if ('app_metadata' in user && user.app_metadata?.provider === 'google') {
        return true
      }
    }
    
    // Check localStorage as final fallback
    const localStorageAuthMethod = localStorage.getItem('userAuthMethod')
    if (localStorageAuthMethod === 'oauth' || localStorageAuthMethod === 'email') {
      return localStorageAuthMethod === 'oauth'
    }
    
    // Default to false (assume email/password user)
    return false
  }, [userData, user])

  const openHelpSupport = () => {
    window.open('/help-documentation', '_blank')
  }

  // Sync form fields with centralized user data
  useEffect(() => {
    if (userData) {
      setFullName(userData.name || '')
      setEmail(userData.email || '')
    }
  }, [userData])

  // Fetch user profile if not available
  useEffect(() => {
    // Only fetch profile if we don't have user data and we're not in the middle of signing out
    if (!user && !userData) {
      log.debug('Profile: No user data available, fetching profile...')
      fetchUserProfile()
    }
  }, [user, userData, fetchUserProfile])

  const handleUpdateProfile = async () => {
    log.debug('Profile: Updating profile for user:', { userId: user?.id, newName: fullName })
    
    await withLoading('update-profile', async () => {
      try {
        await eazynetAPI.updateProfile({
          fullname: fullName
        })

        toast.success("Profile updated successfully")
        setIsEditing(false)
        
        // Refresh centralized user data
        await refreshUserData()
      } catch (error) {
        toast.error("Failed to update profile")
        log.error('Profile update exception:', error)
      }
    })
  }

  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      log.debug('Profile: Starting sign-out process')
      await signOut()
      toast.success("Signed out successfully")
    } catch (err) {
      log.error('Exception during sign out:', err)
      toast.error("Error signing out")
    }
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
      try {
        await eazynetAPI.changePassword({
          currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword
        })

        toast.success("Password changed successfully")
        setIsPasswordDialogOpen(false)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } catch (error) {
        toast.error("Failed to change password")
        log.error('Password change error:', error)
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
                
                {/* Account Status Summary */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Account Type</p>
                    <p className="text-sm text-gray-600">
                      {userData?.isPro ? "Pro Account" : "Free Account"}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userData?.isPro 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {userData?.isPro ? "PRO" : "FREE"}
                  </div>
                </div>
                
                {/* Trial Button for Free Users */}
                {(!userData?.isPro && !userData?.isTrial) && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <h3 className="font-medium text-blue-900 mb-2">Ready to Upgrade?</h3>
                      <p className="text-sm text-blue-700 mb-3">
                        Start your free 14-day trial and unlock all Pro features
                      </p>
                                              <TrialButton 
                          variant="default"
                          size="sm"
                        >
                          Start Free Trial
                        </TrialButton>
                    </div>
                  </div>
                )}
                
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
                
                {!isOAuthUser && (
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
                            Enter your current password and new password below. Password must be at least 8 characters with one letter, one number, and one special character.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="Enter current password"
                              className="mt-1"
                            />
                          </div>
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
                                setCurrentPassword("")
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
                )}

                {isOAuthUser && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Password Management</p>
                      <p className="text-sm text-gray-700">Your account is managed through Google OAuth</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Change Password
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Management */}
            <SubscriptionManager />
            
            {/* Trial Button - Show only for free users */}
            {(!userData?.isPro && !userData?.isTrial) && (
              <Card>
                <CardHeader>
                  <CardTitle>Start Your Free Trial</CardTitle>
                  <CardDescription>
                    Try Pro features free for 7 days. No credit card required.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TrialButton
                    variant="default"
                    className="w-full"
                  >
                    Start Free Trial
                  </TrialButton>
                </CardContent>
              </Card>
            )}
            
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="font-medium text-sm">
                      {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="font-medium text-sm">
                      {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleDateString() : 'N/A'}
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
                <Button variant="ghost" className="w-full justify-start" onClick={openHelpSupport}>
                  Help & Support
                </Button>
               
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/privacy-policy">
                    Privacy Policy
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/terms-and-conditions">
                    Terms of Service
                  </a>
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
    <RouteGuard requireAuth>
      <ProfileContent />
    </RouteGuard>
  )
} 