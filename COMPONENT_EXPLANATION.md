# Line-by-Line Component Explanation

## 1. Root Layout (`src/app/layout.tsx`)

This is the main layout that wraps every page in your application.

### Imports (Lines 1-8)
```typescript
import React from "react";                    // React library for building UI
import type { Metadata } from "next";         // Next.js type for page metadata
import { Inter } from "next/font/google";     // Google Font (Inter) for typography
import "./globals.css";                       // Global CSS styles
import { Toaster } from "@/components/ui/sonner"        // Toast notification component
import { AOSInit } from "@/components/aos-init"         // Animation library initialization
import { ScrollProgress } from "@/components/scroll-progress"  // Progress bar component
import { ScrollToTop } from "@/components/scroll-to-top"       // Back to top button
import { LoadingProvider } from "@/components/loading-context" // Global loading state
```

### Font Configuration (Lines 10-13)
```typescript
const inter = Inter({
  subsets: ["latin"],           // Only load Latin characters (smaller file size)
  variable: "--font-inter",     // CSS variable name for the font
});
```

### SEO Metadata (Lines 15-35)
```typescript
export const metadata: Metadata = {
  title: "EazyNet – Smart Chrome Tab Manager Extension",  // Page title for SEO
  description: "EazyNet is the smartest Chrome tab manager...", // Meta description
  keywords: "Chrome tab manager, tab grouping...",        // SEO keywords
  authors: [{ name: "EazyNet Team" }],                   // Author information
  openGraph: {                                            // Social media sharing
    type: "website",
    url: "https://eazynet.app/",
    title: "EazyNet – Smart Chrome Tab Manager Extension",
    description: "Group, search, and manage your browser tabs...",
    images: [{                                            // Social media image
      url: "https://eazynet.app/images/EazyNetBanner.png",
      width: 1200,
      height: 630,
      alt: "EazyNet Chrome Tab Manager"
    }]
  },
  twitter: {                                              // Twitter-specific metadata
    card: "summary_large_image",
    title: "EazyNet – Smart Chrome Tab Manager Extension",
    description: "EazyNet helps you organize tabs...",
    images: ["https://eazynet.app/images/EazyNetBanner.png"]
  }
};
```

### Root Layout Function (Lines 37-72)
```typescript
export default function RootLayout({
  children,                    // All page content gets passed here
}: Readonly<{
  children: React.ReactNode;   // TypeScript type for React children
}>) {
  return (
    <html lang="en">           // HTML root with English language
      <head>                   // Document head for meta tags
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}  // Apply Inter font and smooth text
      >
        <LoadingProvider>      {/* Global loading state wrapper */}
          <ScrollProgress />   {/* Progress bar at top of page */}
          <AOSInit />         {/* Initialize scroll animations */}
          <div className="page-transition-enter page-transition-enter-active">
            {children}        {/* Render the actual page content */}
          </div>
          <ScrollToTop />     {/* Back to top button */}
          <Toaster position="top-center" />  {/* Toast notifications */}
        </LoadingProvider>
      </body>
    </html>
  );
}
```

## 2. Home Page (`src/app/page.tsx`)

This is the main landing page that imports and renders all sections.

### Imports (Lines 1-14)
```typescript
import { Navigation } from "@/components/navigation"           // Top navigation bar
import { Hero } from "@/components/hero"                      // Hero section
import { ProblemSection } from "@/components/problem-section"  // Problem statement
import { SolutionSection } from "@/components/solution-section" // Solution showcase
import { FeaturesSection } from "@/components/features-section" // Features list
import { HowItWorksSection } from "@/components/how-it-works-section" // How it works
import { DemoVideoSection } from "@/components/demo-video-section" // Video demo
import { BenefitsSection } from "@/components/benefits-section" // Benefits list
import { TestimonialsSection } from "@/components/testimonials-section" // User reviews
import { PricingSection } from "@/components/pricing-section" // Pricing plans
import { CTASection } from "@/components/cta-section"         // Call to action
import { FAQSection } from "@/components/faq-section"         // FAQ section
import { ContactSection } from "@/components/contact-section"  // Contact form
import { Footer } from "@/components/footer"                  // Footer
```

### Home Component (Lines 16-36)
```typescript
export default function Home() {                              // Main page component
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden min-h-screen">
      {/* Main container with white background, dark text, no horizontal scroll, full height */}
      <Navigation />      {/* Top navigation bar */}
      <Hero />           {/* Hero section with main message */}
      <ProblemSection />  {/* What problem we solve */}
      <SolutionSection /> {/* How we solve it */}
      <FeaturesSection /> {/* What features we offer */}
      <HowItWorksSection /> {/* How the product works */}
      <DemoVideoSection /> {/* Video demonstration */}
      <BenefitsSection /> {/* Benefits of using the product */}
      <TestimonialsSection /> {/* User testimonials */}
      <PricingSection />  {/* Pricing information */}
      <CTASection />     {/* Call to action */}
      <FAQSection />     {/* Frequently asked questions */}
      <ContactSection /> {/* Contact form */}
      <Footer />         {/* Footer with links */}
    </main>
  )
}
```

## 3. Hero Component (`src/components/hero.tsx`)

This is the main hero section that appears at the top of the landing page.

### Imports (Lines 1-2)
```typescript
import Image from "next/image"                    // Next.js optimized image component
import { Button } from "@/components/ui/button"   // Reusable button component
```

### Hero Component (Lines 4-32)
```typescript
export function Hero() {                          // Hero section component
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-16 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
      {/* 
        - id="hero": HTML ID for navigation links
        - min-h-screen: Minimum height of 100vh (full screen)
        - flex flex-col: Vertical flexbox layout
        - justify-center items-center: Center content both horizontally and vertically
        - text-center: Center-align text
        - px-6 py-16: Horizontal padding 6, vertical padding 16
        - bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700: Blue to purple gradient
      */}
      
      <Image 
        src="/images/Logo.png"                    // Image source
        alt="EazyNet Chrome Tab Manager Logo"     // Accessibility alt text
        width={64}                                // Image width in pixels
        height={64}                               // Image height in pixels
        className="mx-auto h-16 mb-6"            // Center image, height 16, bottom margin 6
        data-aos="zoom-in"                       // Animation on scroll: zoom in effect
      />
      
      <h1 className="text-5xl font-bold text-white mb-4" data-aos="fade-up" data-aos-delay="200">
        {/* 
          - text-5xl: Very large text size
          - font-bold: Bold font weight
          - text-white: White text color
          - mb-4: Bottom margin
          - data-aos="fade-up": Fade up animation
          - data-aos-delay="200": 200ms delay before animation
        */}
        Best Chrome Tab Manager for Productivity
      </h1>
      
      <p className="text-xl text-gray-200 mb-6" data-aos="fade-up" data-aos-delay="400">
        {/* 
          - text-xl: Large text size
          - text-gray-200: Light gray text color
          - mb-6: Bottom margin
          - data-aos-delay="400": 400ms delay (staggered animation)
        */}
        EazyNet helps you organize browser tabs by domain, path, and usage — making your workflow faster, cleaner, and stress-free.
      </p>
      
      <Button asChild className="px-6 py-3 bg-white text-black rounded-xl font-semibold shadow hover:bg-gray-100 transition-all btn-enhanced" data-aos="fade-up" data-aos-delay="600">
        {/* 
          - asChild: Render as child element instead of button
          - px-6 py-3: Horizontal padding 6, vertical padding 3
          - bg-white text-black: White background, black text
          - rounded-xl: Extra large border radius
          - font-semibold: Semi-bold font weight
          - shadow: Box shadow
          - hover:bg-gray-100: Light gray background on hover
          - transition-all: Smooth transitions for all properties
          - btn-enhanced: Custom CSS class for enhanced styling
          - data-aos-delay="600": 600ms delay (last in sequence)
        */}
        <a 
          href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb" 
          target="_blank"                        // Open in new tab
          rel="noopener noreferrer"              // Security: prevent opener access
        >
          Add to Chrome
        </a>
      </Button>
    </section>
  )
}
```

## 4. Button Component (`src/components/ui/button.tsx`)

This is a reusable button component with multiple variants and sizes.

### Imports (Lines 1-4)
```typescript
import * as React from "react"                   // React library
import { Slot } from "@radix-ui/react-slot"     // Radix UI slot for component composition
import { cva, type VariantProps } from "class-variance-authority"  // Utility for component variants
import { cn } from "@/lib/utils"                 // Utility function for combining CSS classes
```

### Button Variants (Lines 6-35)
```typescript
const buttonVariants = cva(
  // Base styles for all buttons
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {                                // Different button styles
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {                                   // Different button sizes
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {                          // Default values
      variant: "default",
      size: "default",
    },
  }
)
```

### Button Component (Lines 37-59)
```typescript
function Button({
  className,                    // Additional CSS classes
  variant,                     // Button style variant
  size,                        // Button size
  asChild = false,             // Whether to render as child element
  ...props                     // All other button props
}: React.ComponentProps<"button"> &  // Standard button props
  VariantProps<typeof buttonVariants> & {  // Variant props
    asChild?: boolean          // Optional asChild prop
  }) {
  const Comp = asChild ? Slot : "button"  // Use Slot if asChild, otherwise regular button

  return (
    <Comp
      data-slot="button"       // Data attribute for styling
      className={cn(buttonVariants({ variant, size, className }))}  // Combine all classes
      {...props}               // Spread all other props
    />
  )
}

export { Button, buttonVariants }  // Export both component and variants
```

## 5. Utils Function (`src/lib/utils.ts`)

This is a utility function for combining CSS classes safely.

### Imports (Lines 1-2)
```typescript
import { type ClassValue, clsx } from "clsx"    // Utility for conditional classes
import { twMerge } from "tailwind-merge"        // Utility for merging Tailwind classes
```

### CN Function (Lines 4-6)
```typescript
export function cn(...inputs: ClassValue[]) {    // Function that takes any number of class values
  return twMerge(clsx(inputs))                  // Combine classes with clsx, then merge with twMerge
}
```

This function:
1. Takes any number of class values (strings, objects, arrays)
2. Uses `clsx` to combine them conditionally
3. Uses `twMerge` to properly merge Tailwind classes and avoid conflicts
4. Returns a single string of combined classes

## 6. Navigation Component (`src/components/navigation.tsx`)

This is a complex navigation component that handles authentication, mobile menu, and smooth scrolling.

### "use client" Directive (Line 1)
```typescript
"use client"                   // Tells Next.js this component runs on the client (browser)
```

### Imports (Lines 3-18)
```typescript
import { useState, useEffect, useCallback } from "react"  // React hooks for state and effects
import Link from "next/link"                              // Next.js optimized link component
import Image from "next/image"                            // Next.js optimized image component
import { useRouter } from "next/navigation"               // Next.js router hook
import { Button } from "@/components/ui/button"           // Reusable button component
import { Menu, X, User, Settings, LogOut } from "lucide-react"  // Icon components
import { useLoading } from "@/components/loading-context" // Global loading state hook
import { createClient } from "@/lib/supabase/client"      // Supabase client
import type { User as SupabaseUser } from "@supabase/supabase-js"  // TypeScript type
import {
  DropdownMenu,              // Radix UI dropdown components
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
```

### Custom Hook: useNavigationWithLoading (Lines 20-40)
```typescript
function useNavigationWithLoading() {
  const router = useRouter()                              // Next.js router instance
  const { showGlobalLoading, hideGlobalLoading, withLoading } = useLoading()  // Loading context

  const navigateWithLoading = useCallback(async (href: string, options: {
    showLoader?: boolean    // Whether to show loading overlay
    delay?: number         // How long to show loading
    buttonId?: string      // Specific button loading state
  } = {}) => {
    const { showLoader = true, delay = 300, buttonId } = options  // Default values

    if (showLoader) {
      showGlobalLoading()   // Show global loading overlay
    }

    if (buttonId) {
      await withLoading(buttonId, async () => {  // Show button-specific loading
        router.push(href)   // Navigate to new page
      })
    } else {
      router.push(href)     // Navigate without button loading
    }

    // Hide loading after delay to ensure smooth transition
    setTimeout(() => {
      hideGlobalLoading()
    }, delay)
  }, [router, showGlobalLoading, hideGlobalLoading, withLoading])

  return { navigateWithLoading }  // Return the navigation function
}
```

### Navigation Component State (Lines 42-52)
```typescript
export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)           // Mobile menu open/closed
  const [isScrolled, setIsScrolled] = useState(false)          // Whether page is scrolled
  const [activeSection, setActiveSection] = useState('')       // Current active section
  const [user, setUser] = useState<SupabaseUser | null>(null)  // Current authenticated user
  const [isAuthLoading, setIsAuthLoading] = useState(true)     // Authentication loading state
  const router = useRouter()                                    // Next.js router
  const { withLoading } = useLoading()                         // Loading context
  const { navigateWithLoading } = useNavigationWithLoading()   // Custom navigation hook
  const supabase = createClient()                              // Supabase client instance
```

### Scroll Effect (Lines 54-82)
```typescript
useEffect(() => {
  let ticking = false                    // Prevent too many scroll events
  
  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {       // Use requestAnimationFrame for performance
        setIsScrolled(window.scrollY > 10)  // Set scrolled state if scrolled more than 10px
        
        // Update active section based on scroll position
        const sections = ['hero', 'features', 'pricing', 'testimonials', 'contact']
        for (const section of sections) {
          const element = document.getElementById(section)  // Get section element
          if (element) {
            const rect = element.getBoundingClientRect()   // Get element position
            if (rect.top <= 120 && rect.bottom >= 120) {  // If section is in viewport
              setActiveSection(section)                   // Set as active section
              break
            }
          }
        }
        ticking = false
      })
      ticking = true
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })  // Add scroll listener
  return () => window.removeEventListener('scroll', handleScroll)     // Cleanup on unmount
}, [])
```

### Authentication Effect (Lines 84-100)
```typescript
// Check authentication status
useEffect(() => {
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()  // Get current session
    setUser(session?.user || null)                                  // Set user state
    setIsAuthLoading(false)                                         // Stop loading
  }

  checkAuth()  // Check auth on component mount

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    setUser(session?.user || null)  // Update user when auth state changes
    setIsAuthLoading(false)
  })

  return () => subscription.unsubscribe()  // Cleanup subscription on unmount
}, [supabase.auth])
```

## 7. Loading Context (`src/components/loading-context.tsx`)

This is a global state management system for loading states across the entire application.

### "use client" Directive (Line 1)
```typescript
"use client"                   // Client-side component (can use hooks and browser APIs)
```

### Imports (Line 3)
```typescript
import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
// createContext - Create a context for sharing data
// useContext - Hook to consume context
// useState - Hook for managing state
// ReactNode - TypeScript type for React children
// useCallback - Hook to memoize functions
```

### TypeScript Interface (Lines 5-13)
```typescript
interface LoadingContextType {
  loadingStates: Record<string, boolean>                    // Map of loading states by key
  setLoading: (key: string, isLoading: boolean) => void    // Function to set loading state
  isLoading: (key: string) => boolean                      // Function to check if loading
  globalLoading: boolean                                    // Global loading overlay state
  setGlobalLoading: (loading: boolean) => void             // Set global loading
  showGlobalLoading: () => void                            // Show global loading
  hideGlobalLoading: () => void                            // Hide global loading
  withLoading: <T>(key: string, fn: () => Promise<T>) => Promise<T>  // Wrapper for async operations
}
```

### Context Creation (Line 15)
```typescript
const LoadingContext = createContext<LoadingContextType | undefined>(undefined)
// Create context with TypeScript type, initially undefined
```

### Loading Provider Component (Lines 17-58)
```typescript
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})  // Individual loading states
  const [globalLoading, setGlobalLoadingState] = useState(false)                    // Global loading state

  const setLoading = (key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({              // Update loading states
      ...prev,                               // Spread existing states
      [key]: isLoading                       // Set specific key to loading state
    }))
  }

  const isLoading = (key: string) => {
    return loadingStates[key] || false       // Check if specific key is loading
  }

  const setGlobalLoading = (loading: boolean) => {
    setGlobalLoadingState(loading)           // Set global loading state
  }

  const showGlobalLoading = () => {
    setGlobalLoadingState(true)              // Show global loading overlay
  }

  const hideGlobalLoading = () => {
    setGlobalLoadingState(false)             // Hide global loading overlay
  }

  const withLoading = useCallback(async <T,>(key: string, fn: () => Promise<T>): Promise<T> => {
    setLoading(key, true)                    // Set specific loading state to true
    showGlobalLoading()                      // Show global loading overlay
    
    try {
      const result = await fn()              // Execute the async function
      return result                          // Return the result
    } finally {
      // Reduced delay for faster feedback
      setTimeout(() => {
        setLoading(key, false)               // Set specific loading state to false
        hideGlobalLoading()                  // Hide global loading overlay
      }, 150)                               // 150ms delay for smooth transition
    }
  }, [])

  return (
    <LoadingContext.Provider value={{       // Provide context values to children
      loadingStates, 
      setLoading, 
      isLoading, 
      globalLoading, 
      setGlobalLoading, 
      showGlobalLoading, 
      hideGlobalLoading,
      withLoading
    }}>
      {children}                            // Render children components
      {globalLoading && <GlobalLoadingOverlay />}  // Show overlay when global loading is true
    </LoadingContext.Provider>
  )
}
```

### Use Loading Hook (Lines 60-66)
```typescript
export function useLoading() {
  const context = useContext(LoadingContext)  // Get context value
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')  // Error if used outside provider
  }
  return context                              // Return context values
}
```

### Loading Spinner Component (Lines 68-85)
```typescript
export function LoadingSpinner({ size = 'sm', color = 'current' }: { 
  size?: 'sm' | 'md' | 'lg', 
  color?: 'current' | 'white' | 'blue' 
}) {
  const sizeClasses = {                      // Size classes for different spinner sizes
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  const colorClasses = {                     // Color classes for different spinner colors
    current: 'text-current',
    white: 'text-white',
    blue: 'text-blue-600'
  }

  return (
    <svg className={`inline mr-2 animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
}
```

### Global Loading Overlay (Lines 87-99)
```typescript
function GlobalLoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
      {/* 
        - fixed inset-0: Fixed position covering entire screen
        - bg-black/60: Semi-transparent black background
        - backdrop-blur-sm: Blur effect behind overlay
        - z-50: High z-index to appear above other content
        - flex items-center justify-center: Center content
        - animate-in fade-in duration-200: Fade in animation
      */}
      <div className="relative">
        {/* Modern animated rings */}
        <div className="w-16 h-16 border-4 border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-white/10 rounded-full animate-ping"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>
    </div>
  )
} 
```

## Key Concepts Explained:

### 1. **JSX Syntax**
- `<Component />` - Self-closing component
- `<Component>content</Component>` - Component with children
- `className` - CSS classes (instead of `class` in HTML)
- `{variable}` - Embed JavaScript expressions

### 2. **Component Props**
- Props are like function parameters for components
- `{ prop1, prop2, ...rest }` - Destructure props
- `...props` - Spread operator to pass all remaining props

### 3. **CSS Classes**
- Tailwind CSS classes for styling
- `cn()` function safely combines multiple classes
- Conditional classes based on props

### 4. **TypeScript Types**
- `React.ReactNode` - Type for React children
- `VariantProps<typeof buttonVariants>` - Type for component variants
- `Readonly<{ children: React.ReactNode }>` - Read-only prop type

### 5. **Next.js Features**
- `Image` component for optimized images
- `layout.tsx` for global layout
- `page.tsx` for page components
- Metadata API for SEO

### 6. **React Hooks**
- `useState` - Manage component state
- `useEffect` - Handle side effects (API calls, event listeners)
- `useCallback` - Memoize functions for performance
- `useRouter` - Next.js navigation

### 7. **Client vs Server Components**
- `"use client"` - Component runs in browser (can use hooks, event listeners)
- Server components - Run on server (better performance, SEO)

### 8. **Context API (Global State)**
- `createContext` - Create a context for sharing data
- `useContext` - Consume context in components
- Provider pattern - Wrap components to provide context
- Global state management without external libraries

### 9. **Async Operations with Loading States**
- `withLoading` - Wrapper for async operations
- Individual loading states for specific buttons/actions
- Global loading overlay for page transitions
- Proper error handling with try/finally

This structure provides a modern, type-safe, and performant foundation for your web application. 