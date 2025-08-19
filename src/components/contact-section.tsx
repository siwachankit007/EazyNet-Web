"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({ name: "", email: "", message: "" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <section id="contact" className="bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6" data-aos="fade-up">Get in Touch with EazyNet</h2>
        <p className="text-gray-600 mb-12" data-aos="fade-up" data-aos-delay="200">
          Questions? Feedback? Partnership idea? Drop us a message — we&apos;d love to hear from you.
        </p>
      </div>
      <form 
        action="https://formspree.io/f/movdzeoq" 
        method="POST" 
        className="max-w-3xl mx-auto grid grid-cols-1 gap-8 bg-white p-8 rounded-2xl shadow-lg"
        onSubmit={handleSubmit}
        data-aos="fade-up"
        data-aos-delay="400"
      >
        <div>
          <label htmlFor="name" className="block text-left font-semibold text-gray-700 mb-1">
            Name<span className="required-asterisk">*</span>
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.name}
            onChange={handleInputChange}
            suppressHydrationWarning
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-left font-semibold text-gray-700 mb-1">
            Email<span className="required-asterisk">*</span>
          </label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.email}
            onChange={handleInputChange}
            suppressHydrationWarning
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-left font-semibold text-gray-700 mb-1">
            Message<span className="required-asterisk">*</span>
          </label>
          <textarea 
            id="message" 
            name="message" 
            rows={5} 
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            value={formData.message}
            onChange={handleInputChange}
            suppressHydrationWarning
          />
        </div>
        <input type="text" name="_gotcha" style={{ display: 'none' }} />
        <div className="text-center">
          <Button 
            type="submit" 
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:shadow-md transition duration-300"
            suppressHydrationWarning
          >
            Send Message
          </Button>
        </div>
      </form>
    </section>
  )
} 