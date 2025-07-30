export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 px-6 bg-slate-50 text-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
      <h2 className="text-4xl font-bold mb-8 text-white">How EazyNet Boosts Your Productivity</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl text-white mb-2">Smart Tab Search</h3>
          <p className="text-gray-200">Quickly find tabs across all windows, groups, and domains using EazyNet&apos;s real-time search tool.</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <h3 className="text-xl text-white font-semibold mb-2">Automatic Tab Grouping</h3>
          <p className="text-gray-200">Group tabs by domain, path, or usage to keep your browser organized and distraction-free.</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-xl text-white font-semibold mb-2">Customizable Tab Settings</h3>
          <p className="text-gray-200">Tailor your tab experience with custom group names, domain mappings, and personalized shortcuts.</p>
        </div>
      </div>
    </section>
  )
} 