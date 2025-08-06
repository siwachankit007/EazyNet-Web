import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/**
 * Updates the user's last activity timestamp in the database
 * @param userId - The user's ID
 * @returns Promise<void>
 */
export async function updateUserActivity(userId: string): Promise<void> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('users')
      .update({ 
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Error updating user data:', error.message)
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('User data updated successfully for user:', userId)
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Exception updating user data:', error)
    }
  }
}

/**
 * Creates a new user record in the database
 * @param user - The user object from Supabase auth
 * @param fullName - The user's full name
 * @returns Promise<void>
 */
export async function createUserRecord(user: User, fullName: string): Promise<void> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        name: fullName,
        ispro: false, // Default to free account
        created_at: user.created_at,
        updated_at: new Date().toISOString(),
        user_metadata: user.user_metadata
      })

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating user record:', error)
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('User record created successfully for:', user.email)
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Exception creating user record:', error)
    }
  }
} 