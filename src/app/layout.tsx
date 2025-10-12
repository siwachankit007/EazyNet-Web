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
import { UserDataProvider } from "@/lib/user-data-context"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EazyNet Workspace – Fast. Organized. Focused. | Intelligent Workspace Solution",
  description: "EazyNet Workspace transforms tab chaos into an intelligent workspace. Fast memory management, organized AI-powered grouping, and focused productivity for power users.",
  keywords: "workspace management, intelligent workspace, productivity tool, EazyNet Workspace, fast browser, organized tabs, focused workflow, Chrome extension, workspace intelligence, power user productivity, tab organization, memory management",
  authors: [{ name: "EazyNet Team" }],
  creator: "EazyNet Team",
  publisher: "EazyNet Workspace",
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
    title: "EazyNet Workspace – Fast. Organized. Focused. | Intelligent Workspace Solution",
    description: "Transform tab chaos into an intelligent workspace. EazyNet Workspace delivers fast memory management, organized AI-powered grouping, and focused productivity for power users.",
    siteName: "EazyNet Workspace",
    locale: "en_US",
    images: [
      {
        url: "https://eazynet.app/images/EazyNetBanner.png",
        width: 1200,
        height: 630,
        alt: "EazyNet Workspace - Fast. Organized. Focused. Intelligent Workspace",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "EazyNet Workspace – Fast. Organized. Focused.",
    description: "Transform tab chaos into an intelligent workspace. Fast memory management, organized AI-powered grouping, and focused productivity.",
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
              "name": "EazyNet Workspace",
              "description": "Intelligent workspace solution that transforms tab chaos into organized, fast, and focused productivity for power users",
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
                "Fast Memory Management",
                "Organized AI-Powered Grouping", 
                "Focused Workflow Intelligence",
                "Smart Tab Search & Navigation",
                "Cross-device Workspace Sync",
                "Precision-Level Organization (Pro)"
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
        <ErrorBoundary>
          <LoadingProvider>
            <AuthProvider>
              <UserDataProvider>
                <ScrollProgress />
                <AOSInit />
                <div className="page-transition-enter page-transition-enter-active">
                  {children}
                </div>
                <ScrollToTop />
                <Toaster position="top-center" />
              </UserDataProvider>
            </AuthProvider>
          </LoadingProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
