import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "month",
      description: "Access basic features and enjoy EazyNet without any cost.",
      features: [
        "Basic tab grouping",
        "Simple search functionality",
        "Chrome extension",
        "Community support"
      ],
      href: "https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb",
      buttonText: "Get Started",
      popular: false
    },
    {
      name: "Premium",
      price: "$4.99",
      period: "month",
      description: "Unlock advanced features, additional customization, and more.",
      features: [
        "Advanced tab management",
        "Custom domain mapping",
        "Priority support",
        "Cloud sync",
        "Advanced search filters",
        "Custom shortcuts"
      ],
      href: "/auth?plan=premium",
      buttonText: "Coming Soon",
      popular: true
    }
  ]

  return (
    <section id="pricing" className="py-20 px-6 bg-gray-50 text-center">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl font-bold mb-12 text-gray-900">Affordable Pricing Plans</h2>

        <div className="flex flex-col sm:flex-row justify-center gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`w-full sm:w-1/2 lg:w-1/3 relative ${plan.popular ? 'border-blue-500 border-2' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600 mb-4">
                  {plan.description}
                </CardDescription>
                <div className="text-center">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <a 
                    href={plan.href}
                    target={plan.href.startsWith('http') ? '_blank' : undefined}
                    rel={plan.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {plan.buttonText}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}