import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-16 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
      <div className="container mx-auto max-w-4xl">
        <Image 
          src="/images/Logo.png" 
          alt="EazyNet Chrome Tab Manager Logo" 
          width={64} 
          height={64}
          className="mx-auto h-16 w-16 mb-6" 
        />
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Best Chrome Tab Manager for Productivity
        </h1>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          EazyNet helps you organize browser tabs by domain, path, and usage — making your workflow faster, cleaner, and stress-free.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <a 
            href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 text-lg"
          >
            Add to Chrome
          </a>
        </Button>
      </div>
    </section>
  )
}