"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Settings, LogOut } from "lucide-react"
import { useLoading } from "@/components/loading-context"
import { useAuth } from "@/lib/auth-context"
import { getUserDataWithFallback } from "@/lib/user-utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Custom hook for navigation with loading states
function useNavigationWithLoading() {
  const router = useRouter()
  const { showGlobalLoading, hideGlobalLoading, withLoading } = useLoading()

  const navigateWithLoading = useCallback(async (href: string, options: {
    showLoader?: boolean
    delay?: number
    buttonId?: string
  } = {}) => {
    const { showLoader = true, delay = 300, buttonId } = options

    if (showLoader) {
      showGlobalLoading()
    }

    if (buttonId) {
      await withLoading(buttonId, async () => {
        router.push(href)
      })
    } else {
      router.push(href)
    }

    // Hide loading after delay to ensure smooth transition
    setTimeout(() => {
      hideGlobalLoading()
    }, delay)
  }, [router, showGlobalLoading, hideGlobalLoading, withLoading])

  return { navigateWithLoading }
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mounted, setMounted] = useState(false)

  const { navigateWithLoading } = useNavigationWithLoading()
  const { user, isAuthenticated, fetchUserProfile } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10)
          
          // Only update active section if we're actually scrolled down
          if (window.scrollY > 50) {
            const sections = ['hero', 'features', 'pricing', 'testimonials', 'contact']
            for (const section of sections) {
              const element = document.getElementById(section)
              if (element) {
                const rect = element.getBoundingClientRect()
                if (rect.top <= 120 && rect.bottom >= 120) {
                  setActiveSection(section)
                  break
                }
              }
            }
          } else {
            // Reset active section when at top
            setActiveSection('')
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mounted])

  // Fetch user data when user changes
  useEffect(() => {
    if (!mounted) return
    
    if (user) {
      
      // Check if this is an EazyNet user (has name property)
      if ('name' in user) {
       
      } else {
        // For Supabase users, fetch additional data
        const fetchUserData = async () => {
          const freshUserData = await getUserDataWithFallback(user, false) // Don't force refresh
          if (freshUserData) {
            // Handle fresh user data if needed
          }
        }
        fetchUserData()
      }
    } else {
      // No user, clear user data
    }
  }, [user, mounted])

  // Fetch user profile if not available
  useEffect(() => {
    if (!mounted) return
    if (!user && isAuthenticated) {
      fetchUserProfile()
    }
  }, [user, isAuthenticated, fetchUserProfile, mounted])

  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault()
    
    const element = document.getElementById(target)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      })
      
      // Add highlight effect
      element.classList.add('section-highlight')
      setTimeout(() => {
        element.classList.remove('section-highlight')
      }, 400)
    }
    
    setIsMenuOpen(false)
  }, [])

  const handlePageNavigation = useCallback(async (href: string, buttonId: string) => {
    // For dashboard access, check authentication quickly
    if (href === '/dashboard' && !user) {
      await navigateWithLoading('/auth', { buttonId })
      return
    }
    
    // Use navigation with loading for all page transitions
    await navigateWithLoading(href, { 
      buttonId: href === '/dashboard' || href === '/profile' ? buttonId : undefined 
    })
  }, [navigateWithLoading, user])

  const { signOut } = useAuth()

  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Exception during sign out:', err)
    }
  }, [signOut])

  const NavLink = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => {
    const isActive = activeSection === href.replace('/#', '')
    const isSection = href.startsWith('/#')
    
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isSection) {
        // Handle smooth scroll for section links
        e.preventDefault()
        // Check if we're on the home page, if not, navigate there first
        if (window.location.pathname !== '/') {
          navigateWithLoading(href)
        } else {
          handleSmoothScroll(e, href.replace('/#', ''))
        }
      } else if (onClick) {
        // Handle external page navigation
        e.preventDefault()
        onClick(e)
      } else {
        // Default navigation for external links
        e.preventDefault()
        navigateWithLoading(href)
      }
    }
    
    return (
      <a
        href={href}
        onClick={handleClick}
        className={`nav-link relative text-gray-700 font-medium hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50 group ${
          isActive ? 'text-blue-600 bg-blue-50' : ''
        }`}
      >
        {children}
        <span className={`absolute bottom-1 left-1/2 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2 ${
          isActive ? 'w-8 -translate-x-1/2' : 'w-0'
        }`}></span>
      </a>
    )
  }

  return (
    <nav className={`bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100 transition-all duration-200 ${
      isScrolled ? 'shadow-xl backdrop-blur-sm bg-white/95' : ''
    }`} style={{ transform: 'translateZ(0)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group" onClick={() => handlePageNavigation('/', 'logo')}>
          <Image
            src="/images/Logo.png"
            alt="EazyNet Logo"
            width={32}
            height={32}
            className="h-8 w-auto transition-transform group-hover:scale-110"
          />
          <span className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
            EazyNet
          </span>
        </Link>

        {/* Centered Nav Links */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center space-x-2">
            <NavLink href="/#features">Features</NavLink>
            <NavLink href="/#pricing">Pricing</NavLink>
            <NavLink href="/#testimonials">Testimonials</NavLink>
            <NavLink href="/#contact">Contact</NavLink>
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="nav-link relative text-gray-700 font-medium hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-lg hover:bg-blue-50 group focus:outline-none">
                    Tutorial
                    <span className="absolute bottom-1 left-1/2 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2 w-0"></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="center" 
                  sideOffset={8}
                  className="w-48 border-0 shadow-lg"
                  side="bottom"
                  avoidCollisions={true}
                  collisionPadding={8}
                >
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 focus:bg-blue-50 focus:text-blue-600 focus:outline-none">
                    <Link href="/onboarding" onClick={() => handlePageNavigation('/onboarding', 'tutorial')}>
                      Getting Started
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 focus:bg-blue-50 focus:text-blue-600 focus:outline-none">
                    <Link href="/help-documentation" onClick={() => handlePageNavigation('/help-documentation', 'help-docs')}>
                      Help & Documentation
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {/* Only show Dashboard link if user is authenticated */}
            {user && (
              <NavLink href="/dashboard" onClick={() => handlePageNavigation('/dashboard', 'dashboard')}>
                Dashboard
              </NavLink>
            )}
          </div>
        </div>

        {/* CTA & Auth Buttons */}
        <div className="flex items-center gap-4 ml-8">
          <Button asChild className="hidden md:inline-flex px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:shadow-md transition duration-300">
            <a
              href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get EazyNet
            </a>
          </Button>

          {/* Show user dropdown when authenticated, no Join Us button in main header */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 ml-4">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {user && 'name' in user ? user.name : (user?.user_metadata?.name || user?.email?.split('@')[0] || 'User')}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                sideOffset={8}
                className="w-48 max-w-[calc(100vw-2rem)]"
                side="bottom"
                avoidCollisions={true}
                collisionPadding={8}
                style={{ maxWidth: 'min(12rem, calc(100vw - 2rem))' }}
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" onClick={() => handlePageNavigation('/dashboard', 'dashboard-dropdown')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" onClick={() => handlePageNavigation('/profile', 'profile-dropdown')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden md:inline-flex px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:shadow-md transition duration-300">
              <Link href="/auth" onClick={() => handlePageNavigation('/auth', 'join-us')}>
                Join Us
              </Link>
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:bg-blue-50 hover:text-blue-600 transition-colors btn-enhanced"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#features" onClick={(e) => {
              e.preventDefault()
              if (window.location.pathname !== '/') {
                navigateWithLoading('/#features')
              } else {
                handleSmoothScroll(e, 'features')
              }
            }} className="block text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-3 rounded-lg">
              Features
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#pricing" onClick={(e) => {
              e.preventDefault()
              if (window.location.pathname !== '/') {
                navigateWithLoading('/#pricing')
              } else {
                handleSmoothScroll(e, 'pricing')
              }
            }} className="block text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-3 rounded-lg">
              Pricing
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#testimonials" onClick={(e) => {
              e.preventDefault()
              if (window.location.pathname !== '/') {
                navigateWithLoading('/#testimonials')
              } else {
                handleSmoothScroll(e, 'testimonials')
              }
            }} className="block text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-3 rounded-lg">
              Testimonials
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#contact" onClick={(e) => {
              e.preventDefault()
              if (window.location.pathname !== '/') {
                navigateWithLoading('/#contact')
              } else {
                handleSmoothScroll(e, 'contact')
              }
            }} className="block text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-3 rounded-lg">
              Contact
            </a>
            <Link href="/onboarding" onClick={(e) => {
              e.preventDefault()
              navigateWithLoading('/onboarding')
            }} className="block text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-3 rounded-lg">
              Getting Started
            </Link>
            <Link href="/help-documentation" onClick={(e) => {
              e.preventDefault()
              navigateWithLoading('/help-documentation')
            }} className="block text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-3 rounded-lg">
              Help & Documentation
            </Link>
            {/* Only show Dashboard link in mobile menu if user is authenticated */}
            {user && (
              <Link href="/dashboard" onClick={(e) => {
                e.preventDefault()
                navigateWithLoading('/dashboard')
              }} className="block text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-3 rounded-lg">
                Dashboard
              </Link>
            )}
            <div className="pt-4 space-y-3">
              <Button asChild className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transition-all rounded-xl font-semibold">
                <a
                  href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get EazyNet
                </a>
              </Button>
              
              {/* Show Join Us button when not authenticated, or user menu when authenticated */}
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-4 w-4" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {user && 'name' in user ? user.name : (user?.user_metadata?.name || user?.email?.split('@')[0] || 'User')}
                      </p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={(e) => {
                    e.preventDefault()
                    navigateWithLoading('/dashboard')
                  }} className="flex items-center text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-3 rounded-lg">
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link href="/profile" onClick={(e) => {
                    e.preventDefault()
                    navigateWithLoading('/profile')
                  }} className="flex items-center text-gray-700 font-medium hover:text-blue-600 hover:bg-blue-50 transition-all px-4 py-3 rounded-lg">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <button onClick={(e) => {
                    e.preventDefault()
                    handleSignOut()
                  }} className="flex items-center w-full text-left text-gray-700 font-medium hover:text-red-600 hover:bg-red-50 transition-all px-4 py-3 rounded-lg">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Button asChild className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-md transition-all">
                  <Link href="/auth" onClick={(e) => {
                    e.preventDefault()
                    navigateWithLoading('/auth')
                  }}>
                    Join Us
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}