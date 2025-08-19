"use client"

import { useEffect } from 'react'
import AOS from 'aos'

export function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out',
      offset: 30,
      disable: 'mobile', // Disable on mobile for better performance
      debounceDelay: 50, // Debounce scroll events
      throttleDelay: 99, // Throttle scroll events
    })
  }, [])

  return null
} 