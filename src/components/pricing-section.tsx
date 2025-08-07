import { Button } from "@/components/ui/button"
import { UpgradeButton } from "@/components/payment/upgrade-button"

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-6 bg-white text-center">
      <h2 className="text-4xl font-bold mb-12 text-gray-900" data-aos="fade-up">Affordable Pricing Plans</h2>

      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-center gap-8">
        <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/3" data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-xl font-semibold mb-4">Free</h3>
          <p className="text-gray-600 mb-4">Access basic features and enjoy EazyNet without any cost.</p>
          <p className="font-semibold text-lg">$0 / month</p>
          <Button asChild className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-md transition duration-300">
            <a 
              href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Get Started
            </a>
          </Button>
        </div>

        <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/3" data-aos="fade-up" data-aos-delay="400">
          <h3 className="text-xl font-semibold mb-4">Premium (Coming Soon)</h3>
          <p className="text-gray-600 mb-4">Unlock advanced features, additional customization, and more.</p>
          <p className="font-semibold text-lg">$4.99 / month</p>
          <UpgradeButton 
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-md transition duration-300"
            planType="pro"
          >
            Upgrade
          </UpgradeButton>
        </div>
      </div>
    </section>
  )
}