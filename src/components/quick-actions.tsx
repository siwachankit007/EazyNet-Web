import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Chrome, Settings, Download, Search } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Open Extension",
      description: "Launch EazyNet tab manager",
      icon: <Chrome className="h-5 w-5" />,
      action: () => {
        // In a real app, this would communicate with the extension
        window.open('chrome-extension://your-extension-id/popup.html', '_blank')
      }
    },
    {
      title: "Search Tabs",
      description: "Find tabs across all windows",
      icon: <Search className="h-5 w-5" />,
      action: () => {
        // Open search interface
        console.log("Opening search interface")
      }
    },
    {
      title: "Sync Settings",
      description: "Update extension preferences",
      icon: <Settings className="h-5 w-5" />,
      action: () => {
        // Sync settings with extension
        console.log("Syncing settings")
      }
    },
    {
      title: "Export Data",
      description: "Download your tab data",
      icon: <Download className="h-5 w-5" />,
      action: () => {
        // Export functionality
        console.log("Exporting data")
      }
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={action.action}
            >
              <div className="flex items-center space-x-2">
                {action.icon}
                <span className="font-medium">{action.title}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                {action.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}