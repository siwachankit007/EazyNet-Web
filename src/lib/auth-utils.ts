import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/**
 * Updates the loginDateTime for a user in the database
 * @param userId - The user's ID
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function updateLoginDateTime(userId: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('users')
      .update({ 
        logindatetime: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating loginDateTime:', error)
      return false
    }
    
    console.log('LoginDateTime updated successfully for user:', userId)
    return true
  } catch (err) {
    console.error('Exception updating loginDateTime:', err)
    return false
  }
}

/**
 * Creates a new user record in the database
 * @param user - The user object from Supabase auth
 * @param fullName - The user's full name
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function createUserRecord(user: User, fullName: string): Promise<boolean> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        name: fullName,
        logindatetime: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error creating user record:', error)
      return false
    }
    
    console.log('User record created successfully for:', user.email)
    return true
  } catch (err) {
    console.error('Exception creating user record:', err)
    return false
  }
} 