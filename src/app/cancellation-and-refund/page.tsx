import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import Image from "next/image"

export default function CancellationAndRefundPage() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden min-h-screen font-inter">
      <Navigation />
      

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Image src="/images/Logo.png" alt="EazyNet Logo" width={64} height={64} className="mr-4" />
              <h2 className="text-3xl font-bold text-gray-900 font-inter">Cancellation & Refund Policy</h2>
            </div>
            <p className="text-gray-600 text-lg font-inter">Last Updated: Aug 8, 2025</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Introduction */}
          <div className="bg-blue-50 rounded-xl p-8 mb-12">
            <p className="text-gray-700 leading-relaxed text-lg font-inter">
              <strong className="font-semibold">EazyNet</strong> believes in helping its customers as far as possible, and has therefore a liberal cancellation policy for our Chrome extension services. Under this policy:
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Subscription Cancellations */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  1
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Subscription Cancellations</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  Cancellations will be considered only if the request is made within 2-3 days of purchasing a premium subscription. However, the cancellation request may not be entertained if the subscription has already been activated and services have been provided.
                </p>
              </div>
            </div>

            {/* Free Services */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  2
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Free Services</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  EazyNet does not accept cancellation requests for free services or features. However, refund/replacement can be made if the customer establishes that the extension is not functioning as advertised or described.
                </p>
              </div>
            </div>

            {/* Technical Issues */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  3
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Technical Issues</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  In case of technical issues or bugs with the extension, please report the same to our Customer Service team. The request will be entertained once our technical team has verified and determined the issue. This should be reported within 2-3 days of experiencing the problem.
                </p>
              </div>
            </div>

            {/* Functionality Complaints */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  4
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Functionality Complaints</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  In case you feel that the extension functionality is not as shown on our website or as per your expectations, you must bring it to the notice of our customer service within 2-3 days of installation. The Customer Service Team after looking into your complaint will take an appropriate decision.
                </p>
              </div>
            </div>

            {/* Browser Compatibility */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  5
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Browser Compatibility</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                                     In case of complaints regarding browser compatibility or Chrome Web Store policies, please refer the issue to Google&apos;s support channels as these are outside our control.
                </p>
              </div>
            </div>

            {/* Refund Processing */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  6
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Refund Processing</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                                     In case of any Refunds approved by EazyNet, it&apos;ll take 2-3 days for the refund to be processed to the end customer through the original payment method.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <div className="w-24 h-1 bg-gray-300 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-500 text-sm font-inter">
              This cancellation and refund policy is effective as of Aug 8, 2025 and will remain in effect except with respect to any changes in its provisions in the future.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
