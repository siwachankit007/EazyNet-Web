import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { AOSInit } from "@/components/aos-init"
import { ScrollProgress } from "@/components/scroll-progress"
import { ScrollToTop } from "@/components/scroll-to-top"
import { LoadingProvider } from "@/components/loading-context"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EazyNet – Smart Chrome Tab Manager Extension | Organize Browser Tabs",
  description: "EazyNet is the smartest Chrome tab manager that groups, searches, and organizes browser tabs by domain and path. Boost productivity, reduce clutter, and manage unlimited tabs efficiently.",
  keywords: "Chrome tab manager, tab grouping extension, organize browser tabs, productivity, EazyNet, smart tab organization, browser productivity, tab management, Chrome extension, tab groups, auto grouping, smart subgrouping",
  authors: [{ name: "EazyNet Team" }],
  creator: "EazyNet Team",
  publisher: "EazyNet",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://eazynet.app/',
  },
  openGraph: {
    type: "website",
    url: "https://eazynet.app/",
    title: "EazyNet – Smart Chrome Tab Manager Extension | Organize Browser Tabs",
    description: "Group, search, and manage your browser tabs like a pro. EazyNet helps boost your focus and reduce tab clutter with smart grouping and unlimited organization.",
    siteName: "EazyNet",
    locale: "en_US",
    images: [
      {
        url: "https://eazynet.app/images/EazyNetBanner.png",
        width: 1200,
        height: 630,
        alt: "EazyNet Chrome Tab Manager - Smart Tab Organization",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "EazyNet – Smart Chrome Tab Manager Extension",
    description: "EazyNet helps you organize tabs and stay focused. Install now and reduce tab chaos with smart grouping.",
    images: ["https://eazynet.app/images/EazyNetBanner.png"],
    creator: "@eazynet",
    site: "@eazynet"
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-4657754476630097" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4657754476630097" crossOrigin="anonymous"></script>
        
        {/* Structured Data for AI Search Optimization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "EazyNet",
              "description": "Smart Chrome tab manager that groups, searches, and organizes browser tabs by domain and path",
              "url": "https://eazynet.app",
              "applicationCategory": "BrowserExtension",
              "operatingSystem": "Chrome",
              "browserRequirements": "Chrome browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Free plan with powerful features, Pro plan available for advanced features"
              },
              "featureList": [
                "Smart Tab Grouping",
                "Auto Tab Organization", 
                "Tab Search & Navigation",
                "Memory Management",
                "Cross-device Sync",
                "Smart Subgrouping (Pro)"
              ],
              "author": {
                "@type": "Organization",
                "name": "EazyNet Team"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              }
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <LoadingProvider>
          <AuthProvider>
            <ScrollProgress />
            <AOSInit />
            <div className="page-transition-enter page-transition-enter-active">
              {children}
            </div>
            <ScrollToTop />
            <Toaster position="top-center" />
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
