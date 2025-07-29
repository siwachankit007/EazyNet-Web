import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white text-center">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Install EazyNet in Just 2 Clicks
        </h2>
        <p className="text-lg text-gray-100 mb-8">
          Clear your mind and browser with one smart extension.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <a 
            href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc?utm_source=item-share-cb"
            target="_blank" 
            rel="noopener noreferrer"
            className="px-8 py-4 text-lg"
          >
            Add to Chrome - It&apos;s Free!
          </a>
        </Button>
      </div>
    </section>
  )
}