import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section id="cta" className="py-20 px-6 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-center text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold mb-6" data-aos="fade-up">
          Ready to Transform Your Browsing?
        </h2>
        <p className="text-xl mb-8 text-gray-100" data-aos="fade-up" data-aos-delay="200">
          Join thousands of users who have already discovered the power of organized tab management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" data-aos="fade-up" data-aos-delay="400">
          <Button asChild className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg btn-enhanced">
            <a 
              href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Get EazyNet Free
            </a>
          </Button>
          <Button asChild className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg btn-enhanced">
            <Link href="/#features">
              Learn More
            </Link>
          </Button>
        </div>
        <p className="text-sm mt-6 text-gray-200" data-aos="fade-up" data-aos-delay="600">
          🚀 Install in seconds • 🆓 Free forever • ⭐ 4.9/5 rating
        </p>
      </div>
    </section>
  )
}