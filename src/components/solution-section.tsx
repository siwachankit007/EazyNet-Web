import Image from "next/image"

export function SolutionSection() {
  return (
    <section id="solution" className="text-center py-24 px-6 bg-white relative">
      <h2 className="text-5xl font-bold mb-4" data-aos="fade-up">Eliminate Tab Overload with EazyNet</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
        Tame your browser chaos. EazyNet groups, searches, and lets you switch tabs effortlessly — all from one powerful Chrome extension.
      </p>

      <div className="flex justify-center gap-8">
        {/* Screenshot 1 */}
        <div className="w-80 h-64 bg-gray-200 rounded-xl shadow-inner" data-aos="zoom-in">
          <Image 
            src="/images/Home.png" 
            alt="EazyNet interface showing grouped browser tabs" 
            width={320} 
            height={256}
            className="w-full h-full object-cover rounded-xl" 
          />
        </div>
      </div>
    </section>
  )
}