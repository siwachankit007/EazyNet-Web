import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { ProblemSection } from "@/components/problem-section"
import { SolutionSection } from "@/components/solution-section"
import { FeaturesSection } from "@/components/features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { DemoVideoSection } from "@/components/demo-video-section"
import { BenefitsSection } from "@/components/benefits-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { FAQSection } from "@/components/faq-section"
import { FAQSchema } from "@/components/faq-schema"
import { ContactSection } from "@/components/contact-section"
import  Footer  from "@/components/footer"

export default function Home() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden min-h-screen">
      <Navigation />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DemoVideoSection />
      <BenefitsSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <FAQSection />
      <FAQSchema />
      <ContactSection />
      <Footer />
    </main>
  )
}
