import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

export function UserStats() {
  // In a real app, these would come from your database/API
  // TODO: Future implementation - Tabs Managed and Tab Groups data will be available
  const stats = [
    // {
    //   title: "Tabs Managed",
    //   value: "128",
    //   description: "Total tabs organized",
    //   icon: <TrendingUp className="h-4 w-4 text-blue-500" />,
    //   change: "+12 this week"
    // },
    // {
    //   title: "Tab Groups",
    //   value: "42",
    //   description: "Active groupings",
    //   icon: <Folders className="h-4 w-4 text-purple-500" />,
    //   change: "+3 this week"
    // },
    {
      title: "Time Saved",
      value: "2.5h",
      description: "Estimated weekly",
      icon: <Clock className="h-4 w-4 text-green-500" />,
      change: "+30m this week"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      {/* TODO: Future implementation - Tabs Managed and Tab Groups stats will be available when data is ready */}
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
            <p className="text-xs text-green-600 mt-1">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}