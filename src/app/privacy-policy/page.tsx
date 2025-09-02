import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import Image from "next/image"

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden min-h-screen font-inter">
      <Navigation />
      

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Image src="/images/Logo.png" alt="EazyNet Logo" width={64} height={64} className="mr-4" />
              <h2 className="text-3xl font-bold text-gray-900 font-inter">Privacy Policy</h2>
            </div>
            <p className="text-gray-600 text-lg font-inter">Last Updated: April 20, 2025</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Introduction */}
          <div className="bg-blue-50 rounded-xl p-8 mb-12">
            <p className="text-gray-700 leading-relaxed text-lg font-inter">
              At EazyNet, your privacy is extremely important to us. This Privacy Policy outlines the types of information we collect, how we use it, and your rights regarding your personal data. By using EazyNet Tab Manager, you agree to the terms outlined below.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Information We Collect */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  1
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Information We Collect</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 mb-4 font-inter">We collect minimal information necessary to provide our service:</p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center font-inter">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Non-Personal Data
                    </h4>
                    <p className="text-gray-600 text-sm font-inter">Anonymous usage statistics to improve the extension, such as how often features are used.</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center font-inter">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Personal Data (Pro Features)
                    </h4>
                    <p className="text-gray-600 text-sm font-inter">Email address, name, and payment details through secure third-party platforms for Pro subscribers.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  2
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">How We Use Your Information</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 mb-6 font-inter">We use the information we collect to:</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1 flex-shrink-0"></div>
                    <p className="text-gray-700 font-inter">Improve the user experience and core features of EazyNet</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1 flex-shrink-0"></div>
                    <p className="text-gray-700 font-inter">Provide customer support</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1 flex-shrink-0"></div>
                    <p className="text-gray-700 font-inter">Notify you about feature updates or product changes (only if you opt in)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-1 flex-shrink-0"></div>
                    <p className="text-gray-700 font-inter">Analyze usage patterns to enhance our service</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sharing */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  3
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Data Sharing</h3>
              </div>
              <div className="ml-16">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-700 leading-relaxed font-inter">
                    We do not sell, trade, or rent your personal information to third parties. Any third-party services (like payment gateways or analytics) we use are vetted and follow standard data protection practices.
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  4
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Your Rights</h3>
              </div>
              <div className="ml-16">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-700 leading-relaxed mb-4 font-inter">
                    You have the right to access, update, or delete your data. If you have any concerns or requests, email us at <a href="mailto:eazynettabmanager@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold underline">eazynettabmanager@gmail.com</a>.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-700 font-inter">Access</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4v2h12V4H4zm0 4v2h12V8H4zm0 4v2h12v-2H4z" />
                      </svg>
                      <p className="text-sm font-medium text-gray-700 font-inter">Update</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium text-gray-700 font-inter">Delete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  5
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Contact Us</h3>
              </div>
              <div className="ml-16">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-700 leading-relaxed mb-4 font-inter">
                    If you have any questions about this Privacy Policy, contact us at <a href="mailto:eazynettabmanager@gmail.com" className="text-blue-600 hover:text-blue-800 font-semibold underline">eazynettabmanager@gmail.com</a>.
                  </p>
                  <div className="flex items-center justify-center mt-6">
                    <a href="mailto:eazynettabmanager@gmail.com" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <div className="w-24 h-1 bg-gray-300 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-500 text-sm font-inter">
              This privacy policy is effective as of April 20, 2025 and will remain in effect except with respect to any changes in its provisions in the future.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
