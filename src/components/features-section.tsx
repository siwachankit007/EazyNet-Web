"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const features = [
  {
    image: "/images/SearchTabs.png",
    title: "🔍 Smart Tab Search",
    description: "Instantly search across all tabs, windows, and groups — no matter where they're hiding."
  },
  {
    image: "/images/Grouped Tabs.png",
    title: "📂 Auto Grouping",
    description: "Tabs are smartly grouped by domain or usage patterns."
  },
  {
    image: "/images/UpdateDomainMapping.png",
    title: "⬆️ Update Domain Mapping",
    description: "So that you can have customized names for tab groups"
  },
  {
    image: "/images/SearchTabGroups.png",
    title: "🔍 Search Tab Groups",
    description: "Find any tab group and switch to any tab in real time"
  },
  {
    title: "📘 Click For Features Deep Dive",
    description: "Understand the features in depth and become the lord of productivity"
  }
]

export function FeaturesSection() {
  useEffect(() => {
    // Initialize GLightbox
    if (typeof window !== 'undefined') {
      import('glightbox').then((GLightboxModule) => {
        const GLightbox = GLightboxModule.default
        GLightbox({
          selector: '.glightbox'
        })
      })
    }
  }, [])

  return (
    <section id="features" className="py-20 px-6 bg-white text-center relative">
      <h2 className="text-4xl font-bold mb-12 text-gray-900" data-aos="fade-up">Features</h2>

      {/* Navigation and Swiper Container */}
      <div className="relative w-full max-w-7xl mx-auto" data-aos="fade-up" data-aos-delay="200">
        {/* Custom Navigation Buttons - Outside the slider */}
        <div className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 transition cursor-pointer text-4xl -ml-12">
          <i className="fa-solid fa-circle-left text-blue-600 hover:text-blue-800"></i>
        </div>
        <div className="custom-next absolute right-0 top-1/2 -translate-y-1/2 z-10 transition cursor-pointer text-4xl -mr-12">
          <i className="fa-solid fa-circle-right text-blue-600 hover:text-blue-800"></i>
        </div>

        {/* Swiper Carousel */}
        <div className="swiper-container w-full max-w-6xl mx-auto px-4 overflow-hidden">
          <Swiper
            modules={[Navigation]}
            loop={true}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="swiper-wrapper"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} className="swiper-slide">
                <div 
                  className="bg-gray-50 p-6 rounded-2xl shadow-md transition-transform hover:scale-105 duration-300 group cursor-pointer"
                  onClick={() => {
                    if (index === 4) {
                      // Navigate to onboarding page for deep dive
                      window.location.href = '/onboarding#feature-deep-dive'
                    }
                  }}
                >
                  {feature.image && (
                    <a href={feature.image} className="glightbox block mb-4" data-gallery="features-gallery">
                      <Image 
                        src={feature.image} 
                        alt={feature.title} 
                        width={400} 
                        height={200}
                        className="w-full h-48 object-contain mb-4 rounded-xl cursor-zoom-in transition-opacity duration-300 group-hover:opacity-90" 
                      />
                    </a>
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto italic opacity-90 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    {feature.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}