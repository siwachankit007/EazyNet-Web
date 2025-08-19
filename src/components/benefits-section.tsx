

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 px-6 bg-gray-50 text-center">
      <h2 className="text-4xl font-bold mb-12 text-gray-900" data-aos="fade-up">Why Choose EazyNet?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="200">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚡</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Boost Productivity</h3>
          <p className="text-gray-600">
            Stop wasting time hunting for tabs. Find what you need instantly and stay focused on your work.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="400">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🧘</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Reduce Stress</h3>
          <p className="text-gray-600">
            Clean, organized tabs mean less visual clutter and mental fatigue. Browse with peace of mind.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="600">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Stay Organized</h3>
          <p className="text-gray-600">
            Intelligent grouping keeps related tabs together, making it easier to manage complex workflows.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="800">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⏱️</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Save Time</h3>
          <p className="text-gray-600">
            Quick search and smart organization features save you hours every week.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="1000">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🚀</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Work Smarter</h3>
          <p className="text-gray-600">
            Advanced features like domain mapping and group search make you a tab management pro.
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="1200">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">💡</span>
          </div>
          <h3 className="text-xl font-semibold mb-4">Smart & Intuitive</h3>
          <p className="text-gray-600">
            No learning curve required. EazyNet works automatically in the background.
          </p>
        </div>
      </div>
    </section>
  )
}