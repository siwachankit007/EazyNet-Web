import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import Image from "next/image"

export default function ShippingAndDeliveryPage() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden min-h-screen font-inter">
      <Navigation />
      

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Image src="/images/Logo.png" alt="EazyNet Logo" width={64} height={64} className="mr-4" />
              <h2 className="text-3xl font-bold text-gray-900 font-inter">Shipping & Delivery Policy</h2>
            </div>
            <p className="text-gray-600 text-lg font-inter">Last Updated: Aug 8, 2025</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Introduction */}
          <div className="bg-blue-50 rounded-xl p-8 mb-12">
            <p className="text-gray-700 leading-relaxed text-lg font-inter">
              EazyNet is a digital Chrome extension. There is no physical shipping involved.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Digital Delivery */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  1
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Digital Delivery</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  Access is delivered digitally via the Chrome Web Store immediately upon installation. Any paid features (when available) are activated to your account after purchase.
                </p>
              </div>
            </div>

            {/* Instant Access */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  2
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Instant Access</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  Once you install EazyNet from the Chrome Web Store, you have immediate access to all free features. Premium features are activated instantly upon successful payment processing.
                </p>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  3
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Delivery Timeline</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  For International users, digital access is provided through secure online platforms and email delivery systems. For domestic users, access is delivered through registered digital delivery systems and email notifications. Digital access is provided within 0-7 days or as per the delivery date agreed at the time of order confirmation. <strong className="font-semibold">Ankit Singh</strong> or <strong className="font-semibold">EazyNet</strong> is not liable for any delay in delivery by third-party platforms or email services and only guarantees to provide access credentials within 0-7 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation. Delivery of all services will be to the email address provided by the user during registration.
                </p>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  4
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Need Help?</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  For any issues in utilizing our services, you may contact our helpdesk on 
                  <a href="mailto:eazynettabmanager@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold underline ml-1">eazynettabmanager@gmail.com</a>
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <div className="w-24 h-1 bg-gray-300 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-500 text-sm font-inter">
              This shipping and delivery policy is effective as of Aug 8, 2025 and will remain in effect except with respect to any changes in its provisions in the future.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
