import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to log user data consistently
export function logUserData(context: string, user: { [key: string]: unknown } | null | { id: string; email?: string; name?: string; user_metadata?: unknown }, additionalData?: { [key: string]: unknown }) {
  // Only log in development and only if verbose logging is enabled
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_VERBOSE_LOGGING === 'true') {
    const logData = {
      context,
      timestamp: new Date().toISOString(),
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        metadata: user.user_metadata
      } : null,
      ...additionalData
    }
    
    console.log(`[${context}] User Data:`, logData)
    return logData
  }
  return null
}

// Utility function to log authentication events
export function logAuthEvent(event: string, session: { [key: string]: unknown } | null | { user?: { id?: string; email?: string; name?: string; user_metadata?: unknown }; access_token?: string; refresh_token?: string }, additionalData?: { [key: string]: unknown }) {
  // Only log in development and only if verbose logging is enabled
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_VERBOSE_LOGGING === 'true') {
    const logData = {
      event,
      timestamp: new Date().toISOString(),
      session: session ? {
        hasSession: true,
        userId: (session.user as { id?: string; email?: string; name?: string; user_metadata?: unknown })?.id,
        userEmail: (session.user as { id?: string; email?: string; name?: string; user_metadata?: unknown })?.email,
        userName: (session.user as { id?: string; email?: string; name?: string; user_metadata?: unknown })?.name,
        userMetadata: (session.user as { id?: string; email?: string; name?: string; user_metadata?: unknown })?.user_metadata,
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
  return null
}