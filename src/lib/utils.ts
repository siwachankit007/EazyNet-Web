import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for the application

// Production-ready logging utility
export const log = {
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data || '')
    }
  },
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data || '')
    }
  },
  warn: (message: string, data?: unknown) => {
    // Always log warnings in production for monitoring
    console.warn(`[WARN] ${message}`, data || '')
  },
  error: (message: string, data?: unknown) => {
    // Always log errors in production for monitoring
    console.error(`[ERROR] ${message}`, data || '')
  }
}

// User data logging utility (development only)
export const logUserData = (context: string, user: unknown, logData?: Record<string, unknown>) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${context}] User Data:`, logData)
  }
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