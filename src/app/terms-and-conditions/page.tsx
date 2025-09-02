import { Navigation } from "@/components/navigation"
import Footer from "@/components/footer"
import Image from "next/image"

export default function TermsAndConditionsPage() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden min-h-screen font-inter">
      <Navigation />
      

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Image src="/images/Logo.png" alt="EazyNet Logo" width={64} height={64} className="mr-4" />
              <h2 className="text-3xl font-bold text-gray-900 font-inter">Terms & Conditions</h2>
            </div>
            <p className="text-gray-600 text-lg font-inter">Last Updated: August 8, 2025</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Introduction */}
          <div className="bg-blue-50 rounded-xl p-8 mb-12">
            <p className="text-gray-700 leading-relaxed text-lg font-inter">
              For the purpose of these Terms and Conditions, the term
                             <strong className="font-semibold"> &quot;we&quot;, &quot;us&quot;, &quot;our&quot;</strong> used anywhere on this page shall mean
              <strong className="font-semibold"> Ankit Singh</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4 font-inter">
                             <strong className="font-semibold">&quot;you&quot;, &quot;your&quot;, &quot;user&quot;, &quot;visitor&quot;</strong> shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <p className="text-gray-700 font-inter">
                             Hereinafter, the foregoing entity shall be referred to as <strong className="font-semibold">&quot;EazyNet&quot;</strong> for ease of reference.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed mb-12 text-lg font-inter">
            Your use of the website and/or purchase from us are governed by the following Terms and Conditions:
          </p>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Content Changes */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  1
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Content Changes</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  The content of the pages of this website is subject to change without notice.
                </p>
              </div>
            </div>

            {/* Accuracy & Liability */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  2
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Accuracy & Liability</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
                </p>
              </div>
            </div>

            {/* Use at Your Own Risk */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  3
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Use at Your Own Risk</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  4
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Intellectual Property</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
                </p>
              </div>
            </div>

            {/* Trademarks */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  5
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Trademarks</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.
                </p>
              </div>
            </div>

            {/* Unauthorized Use */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  6
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Unauthorized Use</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
                </p>
              </div>
            </div>

            {/* External Links */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  7
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">External Links</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.
                </p>
              </div>
            </div>

            {/* Linking to Our Website */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  8
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Linking to Our Website</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                                     You may not create a link to our website from another website or document without EazyNet&apos;s prior written consent.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  9
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Governing Law</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.
                </p>
              </div>
            </div>

            {/* Transaction Limits */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4">
                  10
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 font-inter">Transaction Limits</h3>
              </div>
              <div className="ml-16">
                <p className="text-gray-700 font-inter">
                  We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <div className="w-24 h-1 bg-gray-300 mx-auto mb-4 rounded-full"></div>
            <p className="text-gray-500 text-sm font-inter">
              These terms and conditions are effective as of August 8, 2025 and will remain in effect except with respect to any changes in its provisions in the future.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
