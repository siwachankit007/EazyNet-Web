import Image from "next/image"

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 px-6 bg-slate-50 text-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
      <h2 className="text-4xl font-bold mb-8 text-white" data-aos="fade-up">What Users Love About EazyNet</h2>
      <div className="flex flex-col items-center md:flex-row gap-12 justify-center">
        <div className="w-full md:w-1/3 bg-white p-8 rounded-xl shadow-md" data-aos="fade-right" data-aos-delay="200">
          <p className="text-gray-600 mb-4">
            &ldquo;EazyNet has transformed the way I work! I no longer have to hunt for tabs. Everything is organized beautifully.&rdquo;
          </p>
          <div className="flex items-center justify-center">
            <Image 
              src="/images/user1.png" 
              alt="Teressa William – Software Developer review" 
              width={96} 
              height={96}
              className="w-24 h-24 rounded-full mr-8" 
              data-aos="zoom-in"
              data-aos-delay="400"
            />
            <div>
              <h4 className="font-semibold">Teressa William</h4>
              <p className="text-gray-500">Software Developer</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-white p-8 rounded-xl shadow-md" data-aos="fade-left" data-aos-delay="200">
          <p className="text-gray-600 mb-4">
            &ldquo;I can finally keep all my tabs organized without feeling overwhelmed. A must-have for anyone with lots of tabs!&rdquo;
          </p>
          <div className="flex items-center justify-center">
            <Image 
              src="/images/user2.jpg" 
              alt="Hobert Smith – Product Manager testimonial" 
              width={96} 
              height={96}
              className="w-24 h-24 rounded-full mr-4" 
              data-aos="zoom-in"
              data-aos-delay="400"
            />
            <div>
              <h4 className="font-semibold">Hobert Smith</h4>
              <p className="text-gray-500">Product Manager</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}