"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { UpgradeButton } from "@/components/payment/upgrade-button"
import { useAuth } from "@/lib/auth-context"

// Interactive FAQ Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div 
      className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button 
        className="cursor-pointer w-full flex justify-between items-center px-5 py-4 text-left hover:bg-gray-50 transition group"
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
      >
        <span className="font-medium text-gray-900 text-base group-hover:text-blue-600">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 text-gray-600 text-sm">
              <p className="py-3">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Interactive Feature Card Component
function FeatureCard({ 
  title, 
  description, 
  icon, 
  isPro = false, 
  delay = 0 
}: { 
  title: string
  description: string
  icon: string
  isPro?: boolean
  delay?: number
}) {
  return (
    <motion.div 
      className={`p-6 rounded-xl shadow-sm ${isPro ? 'bg-white border' : 'bg-gray-50'}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}
    >
      <h3 className={`text-xl font-semibold mb-2 ${isPro ? 'text-purple-700' : 'text-blue-700'}`}>
        {icon} {title}
      </h3>
      <p className="text-gray-700">{description}</p>
      {isPro && (
        <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
          Pro Feature
        </span>
      )}
    </motion.div>
  )
}

// Interactive Step Component
function StepCard({ 
  number, 
  title, 
  description, 
  icon, 
  delay = 0 
}: { 
  number: number
  title: string
  description: string
  icon: string
  delay?: number
}) {
  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div 
        className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center mb-4 relative"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-2xl">{icon}</span>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-blue-600">{number}</span>
        </div>
      </motion.div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  )
}

// Interactive Table Row Component
function TableRow({ 
  feature, 
  free, 
  pro, 
  isPro = false 
}: { 
  feature: string
  free: string
  pro: string
  isPro?: boolean
}) {
  return (
    <motion.tr 
      className="hover:bg-gray-50"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.05)" }}
    >
      <td className="text-left px-6 py-4 border-b border-gray-200 font-medium">{feature}</td>
      <td className="text-center px-6 py-4 border-b border-gray-200">{free}</td>
      <td className={`text-center px-6 py-4 border-b border-gray-200 ${isPro ? 'bg-blue-50' : ''}`}>
        <span className={isPro ? 'text-green-600 font-medium' : ''}>{pro}</span>
      </td>
    </motion.tr>
  )
}



export default function OnboardingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const { isPro } = useAuth()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const faqData = [
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

  const featureData = [
    {
      title: "Group Tabs by Domain",
      description: "Instantly groups all open tabs based on domain (e.g., YouTube, GitHub, etc.).",
      icon: "🗂️",
      isPro: false
    },
    {
      title: "Smart Subgrouping",
      description: "Groups tabs not just by domain, but also by URL path for precision-level organization.",
      icon: "🧠",
      isPro: true
    },
    {
      title: "Smart Tab Search",
      description: "Instantly searches across all your tabs with intelligent filtering.",
      icon: "🔍",
      isPro: false
    },
    {
      title: "Auto Tab Grouping",
      description: "Automatically groups new tabs by domain or path without manual action.",
      icon: "⚙️",
      isPro: true
    },
    {
      title: "Mapping Updates",
      description: "Allows renaming or re-mapping groups per domain for personalized workflow.",
      icon: "✏️",
      isPro: false
    },
    {
      title: "Tab Memory Saver",
      description: "Snoozes unused tabs to free up memory while keeping them accessible.",
      icon: "🛌",
      isPro: false
    },
    {
      title: "Group Memory Saver",
      description: "Snoozes all tabs in a group with one click for efficient project management.",
      icon: "🧊",
      isPro: true
    },
    {
      title: "Auto Memory Management",
      description: "Automatically snoozes unused tabs every 30 mins to keep your browser fast.",
      icon: "🔁",
      isPro: true
    },
    {
      title: "Sync Across Devices",
      description: "Keeps your groups and settings synced across all Chrome devices.",
      icon: "🌐",
      isPro: true
    },
    {
      title: "Priority Support",
      description: "Pro users get faster, personalized help and dedicated support.",
      icon: "📩",
      isPro: true
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Onboarding Hero Section */}
      <motion.section 
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-16 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
            backgroundSize: ["100% 100%", "200% 200%"]
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}
        />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image 
            src="/images/Logo.png" 
            alt="EazyNet Logo" 
            width={80} 
            height={80}
            className="mx-auto mb-6 drop-shadow-lg"
          />
        </motion.div>
        
        <motion.h1 
          className="text-6xl font-bold text-white mb-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Welcome to EazyNet !
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-200 mb-8 max-w-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Let&apos;s quickly show you how to master your tabs like a pro.
        </motion.p>
        
        <motion.a 
          href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-8 py-4 bg-white text-black rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Add to Chrome
        </motion.a>
      </motion.section>

      {/* Onboarding Steps */}
      <section className="py-20 px-6 bg-white text-center relative">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          How to Use EazyNet
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <StepCard 
            number={1}
            title="Group Tabs"
            description="Click 'Group Tabs' to instantly organize tabs by domain."
            icon="🗂️"
            delay={0.1}
          />
          <StepCard 
            number={2}
            title="Search Tabs"
            description="Quickly find and switch to any tab with Smart Search."
            icon="🔍"
            delay={0.2}
          />
          <StepCard 
            number={3}
            title="Upgrade for Pro"
            description="Enable advanced features like Smart Subgrouping for maximum productivity."
            icon="⭐"
            delay={0.3}
          />
        </div>
      </section>

      {/* Free vs Pro Section */}
      <section className="py-20 px-6 bg-white text-center">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Free vs Pro
        </motion.h2>

        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto table-auto border-collapse shadow-lg rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-gray-800 text-lg">
                <th className="text-left px-6 py-4 border-b-2 border-gray-200 text-white">Feature</th>
                <th className="px-6 py-4 border-b-2 border-gray-200 text-white">Free</th>
                <th className="px-6 py-4 border-b-2 border-gray-200 text-blue-700 text-white">Pro</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-base">
              <TableRow feature="Group Tabs by Domain" free="✔️" pro="✔️" />
              <TableRow feature="Smart Subgrouping (Path-Based)" free="—" pro="✔️" isPro />
              <TableRow feature="Automatic Tabs Grouping" free="—" pro="✔️" isPro />
              <TableRow feature="Mapping Updates per Domain" free="5" pro="Unlimited" />
              <TableRow feature="Tab Search & Navigation" free="✔️" pro="✔️" />
              <TableRow feature="Individual Tab Memory Management" free="10 Tabs" pro="Unlimited" />
              <TableRow feature="Tabs Group Memory Management" free="—" pro="✔️" isPro />
              <TableRow feature="Automatic Browser Memory Management" free="—" pro="✔️" isPro />
              <TableRow feature="Priority Support" free="—" pro="✔️" isPro />
              <TableRow feature="Sync Across Devices" free="—" pro="✔️" isPro />
            </tbody>
          </table>
        </div>
        
        {!isPro && (
          <motion.div 
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <UpgradeButton 
              className="upgrade-pro-btn inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              planType="pro"
            >
              Upgrade to Pro
            </UpgradeButton>
          </motion.div>
        )}
      </section>

      {/* Feature Deep Dive Section */}
      <section id="feature-deep-dive" className="py-20 px-6 bg-white text-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Feature Deep Dive
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto text-left">
          {featureData.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              isPro={feature.isPro}
              delay={index * 0.1}
            />
          ))}
        </div>

                 {!isPro && (
                   <motion.div 
                     className="mt-12"
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                   >
                     <UpgradeButton 
                       className="upgrade-pro-btn inline-block px-8 py-3 bg-white text-gray-800 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                       planType="pro"
                     >
                       Upgrade to Pro
                     </UpgradeButton>
                   </motion.div>
                 )}
      </section>

      {/* Onboarding Pro Section */}
      <section className="py-20 px-6 bg-gray-50 text-center">
        <motion.h2 
          className="text-4xl font-bold mb-12 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Why Upgrade to Pro?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <h3 className="text-xl font-semibold mb-4">✨ Smart Subgrouping</h3>
            <p className="text-gray-600">Automatically group tabs based on paths for deeper organization.</p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-lg shadow-md"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <h3 className="text-xl font-semibold mb-4">🔓 Unlimited Mapping Updates</h3>
            <p className="text-gray-600">Customize your tab groups without any restrictions.</p>
          </motion.div>
        </div>

                 <motion.div 
           className="mt-8"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
         >
           {!isPro && (
             <UpgradeButton 
               className="upgrade-pro-btn inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
               planType="pro"
             >
               Upgrade to Pro
             </UpgradeButton>
           )}
         </motion.div>
      </section>

      {/* Demo Section */}
      <section className="py-20 px-6 bg-white text-center">
        <motion.h2 
          className="text-4xl font-bold mb-8 text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Watch EazyNet in Action
        </motion.h2>
        <motion.div 
          className="relative max-w-4xl mx-auto"
          style={{ paddingTop: '30.25%' }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <iframe 
            src="https://www.youtube.com/embed/fb9KS9Nzb54" 
            title="EazyNet Demo" 
            allowFullScreen 
            className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
          />
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            className="text-4xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white text-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
            backgroundSize: ["100% 100%", "200% 200%"]
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}
        />
        
        <motion.h2 
          className="text-3xl font-bold mb-4 relative z-10"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          You&apos;re Ready to Go!
        </motion.h2>
        <motion.p 
          className="text-lg text-gray-100 mb-8 relative z-10"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Open your extension and start organizing your tabs like a pro.
        </motion.p>
        <motion.a 
          href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="px-8 py-4 bg-white text-black rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105 relative z-10 inline-block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Open EazyNet Extension
        </motion.a>
      </motion.section>

      <Footer />
    </div>
  )
} 