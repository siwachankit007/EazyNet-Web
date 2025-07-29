import Image from "next/image"
import { Card, CardContent, CardDescription } from "@/components/ui/card"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "EazyNet has transformed the way I work! I no longer have to hunt for tabs. Everything is organized beautifully.",
      name: "Teressa William",
      role: "Software Developer",
      avatar: "/images/user1.png"
    },
    {
      quote: "I can finally keep all my tabs organized without feeling overwhelmed. A must-have for anyone with lots of tabs!",
      name: "Hobert Smith",
      role: "Product Manager",
      avatar: "/images/user2.jpg"
    }
  ]

  return (
    <section id="testimonials" className="py-20 px-6 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-center">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold mb-8 text-white">What Users Love About EazyNet</h2>
        <div className="flex flex-col items-center md:flex-row gap-12 justify-center">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="w-full md:w-1/3 bg-white">
              <CardContent className="p-8">
                <CardDescription className="text-gray-600 mb-4 text-base">
                  &ldquo;{testimonial.quote}&rdquo;
                </CardDescription>
                <div className="flex items-center justify-center">
                  <Image 
                    src={testimonial.avatar} 
                    alt={`${testimonial.name} review`} 
                    width={96} 
                    height={96}
                    className="w-24 h-24 rounded-full mr-4" 
                  />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}