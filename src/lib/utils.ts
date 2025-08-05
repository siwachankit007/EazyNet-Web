import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to log user data consistently
export function logUserData(context: string, user: { [key: string]: unknown } | null | { id: string; email?: string; user_metadata?: unknown }, additionalData?: { [key: string]: unknown }) {
  const logData = {
    context,
    timestamp: new Date().toISOString(),
    user: user ? {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata,
      lastSignIn: user.last_sign_in_at,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    } : null,
    ...additionalData
  }
  
  console.log(`[${context}] User Data:`, logData)
  return logData
}

// Utility function to log authentication events
export function logAuthEvent(event: string, session: { [key: string]: unknown } | null | { user?: { id: string; email?: string; user_metadata?: unknown }; access_token?: string; refresh_token?: string }, additionalData?: { [key: string]: unknown }) {
  const logData = {
    event,
    timestamp: new Date().toISOString(),
    session: session ? {
      hasSession: true,
      userId: session.user?.id,
      userEmail: session.user?.email,
      userMetadata: session.user?.user_metadata,
      accessToken: session.access_token ? 'present' : 'missing',
      refreshToken: session.refresh_token ? 'present' : 'missing'
    } : {
      hasSession: false
    },
    ...additionalData
  }
  
  console.log(`[AUTH] ${event}:`, logData)
  return logData
}