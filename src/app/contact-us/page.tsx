"use client"

import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import Image from "next/image"

export default function ContactUsPage() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden min-h-screen font-inter">
      <Navigation />
      

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Image src="/images/Logo.png" alt="EazyNet Logo" width={64} height={64} className="mr-4" />
              <h2 className="text-3xl font-bold text-gray-900 font-inter">Contact Us</h2>
            </div>
            <p className="text-gray-600 text-lg font-inter">Get in touch with our team</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Introduction */}
          <div className="bg-blue-50 rounded-xl p-8 mb-12">
            <p className="text-gray-700 leading-relaxed text-lg font-inter">
                             Questions? Feedback? Partnership idea? Drop us a message — we&apos;d love to hear from you. We usually respond within 1–2 business days.
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 font-inter mb-6">Send us a Message</h3>
                                                   <form action="https://formspree.io/f/movdzeoq" method="POST" className="space-y-6" suppressHydrationWarning>
              <div>
                <label htmlFor="name" className="block font-semibold text-gray-700 mb-2 font-inter">
                  Name <span className="text-red-500">*</span>
                </label>
                                                                   <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                  />
              </div>
              <div>
                <label htmlFor="email" className="block font-semibold text-gray-700 mb-2 font-inter">
                  Email <span className="text-red-500">*</span>
                </label>
                                                                   <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    autoComplete="email"
                    suppressHydrationWarning
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-inter"
                  />
              </div>
              <div>
                <label htmlFor="message" className="block font-semibold text-gray-700 mb-2 font-inter">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5} 
                  required 
                  minLength={10}
                  maxLength={1000}
                  autoComplete="off"
                  suppressHydrationWarning
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-inter"
                />
              </div>
              <input type="text" name="_gotcha" style={{display: 'none'}} />
              <div className="text-center">
                                 <button 
                   type="submit" 
                   suppressHydrationWarning
                   className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors font-inter"
                 >
                   Send Message
                 </button>
              </div>
            </form>
          </div>

          {/* Direct Contact Information */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-900 font-inter mb-6">Direct Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  📧
                </div>
                <div>
                  <p className="text-gray-700 font-inter">
                    Email us at: <a href="mailto:eazynettabmanager@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold underline">eazynettabmanager@gmail.com</a>
                  </p>
                </div>
              </div>
            
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
              <p className="text-gray-700 font-inter">
                For any issues in utilizing our services, you may contact our helpdesk on the above contact details.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <div className="w-24 h-1 bg-gray-300 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-500 text-sm font-inter">
                             We&apos;re here to help! Reach out to us anytime and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
