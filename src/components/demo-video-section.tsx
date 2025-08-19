export function DemoVideoSection() {
  return (
    <section id="demo-video" className="py-24 px-6 bg-white text-center">
      <h2 className="text-4xl font-bold mb-6 text-gray-900">See EazyNet in Action</h2>
      <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
        Watch how EazyNet helps you manage Chrome tabs more efficiently. Learn how to group, search, and navigate like a pro.
      </p>
      <div className="relative max-w-4xl mx-auto" style={{ paddingTop: '30.25%' }}>
        <iframe 
          src="https://www.youtube.com/embed/fb9KS9Nzb54" 
          title="EazyNet Chrome Extension Demo – Tab Management Made Simple" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen 
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </section>
  )
} 