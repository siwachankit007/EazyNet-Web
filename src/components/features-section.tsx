import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FolderTree, Settings, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-500" />,
      title: "🔍 Smart Tab Search",
      description: "Instantly search across all tabs, windows, and groups — no matter where they're hiding.",
      image: "/images/SearchTabs.png"
    },
    {
      icon: <FolderTree className="w-8 h-8 text-green-500" />,
      title: "📂 Auto Grouping",
      description: "Tabs are smartly grouped by domain or usage patterns.",
      image: "/images/Grouped Tabs.png"
    },
    {
      icon: <Settings className="w-8 h-8 text-purple-500" />,
      title: "⬆️ Update Domain Mapping",
      description: "So that you can have customized names for tab groups",
      image: "/images/UpdateDomainMapping.png"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "🔍 Search Tab Groups",
      description: "Find any tab group and switch to any tab in real time",
      image: "/images/SearchTabs.png"
    }
  ]

  return (
    <section id="features" className="py-20 px-6 bg-gray-50 text-center relative">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold mb-12 text-gray-900">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-lg w-fit">
                  {feature.icon}
                </div>
                <Image 
                  src={feature.image} 
                  alt={feature.title} 
                  width={300} 
                  height={200}
                  className="w-full h-48 object-contain mb-4 rounded-lg" 
                />
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}