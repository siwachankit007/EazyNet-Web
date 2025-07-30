import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ProblemSection() {
  return (
    <section id="problem" className="text-center py-24 px-6 bg-gray-50 relative">
      <Image 
        src="/images/Logo.png" 
        alt="EazyNet Tab Manager Logo" 
        width={64} 
        height={64}
        className="mx-auto h-16 mb-6" 
        data-aos="zoom-in"
      />
      <h2 className="text-5xl font-bold mb-4" data-aos="fade-up">Too Many Tabs Slowing You Down?</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
        If your browser is filled with endless tabs, you&apos;re not alone. EazyNet helps you search, group, and organize tabs—so you can focus on what matters most.
      </p>
      <Button asChild className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:shadow-md transition duration-300" data-aos="fade-up" data-aos-delay="400">
        <a href="#features">
          Explore Features
        </a>
      </Button>
    </section>
  )
}