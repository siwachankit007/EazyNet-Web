import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

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
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
