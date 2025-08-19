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
  title: "EazyNet – Smart Chrome Tab Manager Extension",
  description: "EazyNet is the smartest Chrome tab manager. Group, search, and organize browser tabs to boost productivity and reduce clutter.",
  keywords: "Chrome tab manager, tab grouping extension, organize browser tabs, productivity, EazyNet",
  authors: [{ name: "EazyNet Team" }],
  openGraph: {
    type: "website",
    url: "https://eazynet.app/",
    title: "EazyNet – Smart Chrome Tab Manager Extension",
    description: "Group, search, and manage your browser tabs like a pro. EazyNet helps boost your focus and reduce tab clutter.",
    images: [
      {
        url: "https://eazynet.app/images/EazyNetBanner.png",
        width: 1200,
        height: 630,
        alt: "EazyNet Chrome Tab Manager"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "EazyNet – Smart Chrome Tab Manager Extension",
    description: "EazyNet helps you organize tabs and stay focused. Install now and reduce tab chaos.",
    images: ["https://eazynet.app/images/EazyNetBanner.png"]
  }
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
