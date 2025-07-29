import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ProblemSection() {
  return (
    <section className="text-center py-24 px-6 bg-gray-50 relative">
      <div className="container mx-auto max-w-4xl">
        <Image 
          src="/images/Logo.png" 
          alt="EazyNet Tab Manager Logo" 
          width={64} 
          height={64}
          className="mx-auto h-16 w-16 mb-6" 
        />
        <h2 className="text-5xl font-bold mb-4">Too Many Tabs Slowing You Down?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          If your browser is filled with endless tabs, you&apos;re not alone. EazyNet helps you search, group, and organize tabs—so you can focus on what matters most.
        </p>
        <Button size="lg" asChild>
          <a href="#features">
            Explore Features
          </a>
        </Button>
      </div>
    </section>
  )
}