import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-16 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
      <Image 
        src="/images/Logo.png" 
        alt="EazyNet Chrome Tab Manager Logo" 
        width={64} 
        height={64}
        className="mx-auto h-16 mb-6" 
        data-aos="zoom-in"
      />
      <h1 className="text-5xl font-bold text-white mb-4" data-aos="fade-up" data-aos-delay="200">
        Best Chrome Tab Manager for Productivity
      </h1>
      <p className="text-xl text-gray-200 mb-6" data-aos="fade-up" data-aos-delay="400">
        EazyNet helps you organize browser tabs by domain, path, and usage — making your workflow faster, cleaner, and stress-free.
      </p>
      <Button asChild className="px-6 py-3 bg-white text-black rounded-xl font-semibold shadow hover:bg-gray-100 transition-all btn-enhanced" data-aos="fade-up" data-aos-delay="600">
        <a 
          href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Add to Chrome
        </a>
      </Button>
    </section>
  )
}