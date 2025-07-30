"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What is EazyNet?",
    answer: "EazyNet is a Chrome extension that helps you group, search, and organize tabs to reduce clutter and improve focus."
  },
  {
    question: "Is EazyNet free?",
    answer: "Yes! EazyNet has a free plan with powerful features. You can upgrade to Pro for advanced tools like smart subgrouping and unlimited mapping updates."
  },
  {
    question: "What is Smart Subgrouping?",
    answer: "It's a Pro feature that groups tabs not just by domain, but by path — for example, different product pages on Amazon will be in separate subgroups."
  },
  {
    question: "Will it slow down my browser?",
    answer: "Not at all. EazyNet is built with performance in mind and runs efficiently in the background without affecting browsing speed."
  },
  {
    question: "Can I use it across multiple devices?",
    answer: "Yes! If you're a Pro user, your settings and groups sync automatically via Chrome sync — so your setup follows you everywhere."
  },
  {
    question: "How do I contact support?",
    answer: "You can email us at eazynettabmanager@gmail.com or use the contact form at the bottom of this page."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
              <button 
                className="faq-question cursor-pointer w-full flex justify-between items-center px-5 py-4 text-left hover:bg-gray-50 transition group"
                onClick={() => toggleFAQ(index)}
                suppressHydrationWarning
              >
                <span className="font-medium text-gray-900 text-base group-hover:text-blue-600">
                  {faq.question}
                </span>
                <svg 
                  className={`icon w-5 h-5 text-gray-500 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>
              <div className={`faq-answer px-5 text-gray-600 text-sm ${openIndex === index ? 'block' : 'hidden'}`}>
                <p className="py-3">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 