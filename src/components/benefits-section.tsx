import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Minimize, Chrome } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      title: "Boost Productivity",
      description: "EazyNet speeds up your workflow by organizing your tabs, so you can switch between tasks without losing focus."
    },
    {
      icon: <Minimize className="w-8 h-8 text-green-500" />,
      title: "Declutter Your Browser",
      description: "Avoid tab overload with smart grouping features that reduce visual clutter and improve efficiency."
    },
    {
      icon: <Chrome className="w-8 h-8 text-purple-500" />,
      title: "Easy Chrome Integration",
      description: "Enjoy seamless use with the Chrome browser. EazyNet works out-of-the-box with an intuitive interface and one-click actions."
    }
  ]

  return (
    <section id="benefits" className="py-20 px-6 bg-white text-center">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold mb-8 text-gray-900">Top Reasons to Use EazyNet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-lg w-fit">
                  {benefit.icon}
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-xl font-semibold mb-4">
                  {benefit.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}