import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Settings, Download, Search } from "lucide-react"
import { toast } from "sonner"

// TypeScript declarations for Chrome extension API
interface ChromeRuntime {
  sendMessage: (extensionId: string, message: Record<string, unknown>, callback?: (response: unknown) => void) => void
  lastError?: { message: string }
}

interface ChromeAPI {
  runtime?: ChromeRuntime
}

interface ExtendedWindow extends Window {
  chrome?: ChromeAPI
}

export function QuickActions() {
  // Shared function to open extension
  const openExtension = () => {
    const extendedWindow = window as ExtendedWindow
    if (typeof window !== 'undefined' && extendedWindow.chrome?.runtime) {
      console.log('Attempting to send message to extension...')
      extendedWindow.chrome.runtime.sendMessage('ghkblcolgioaoajmhciloahjjcbhekbi', { action: 'open' }, (response: unknown) => {
        console.log('Extension response:', response)
        if (extendedWindow.chrome?.runtime?.lastError) {
          console.log('Extension error:', extendedWindow.chrome.runtime.lastError)
          toast.success('Press Ctrl+Shift+E to open the EazyNet extension, or click the extension icon in your browser toolbar.')
        } else if (response && typeof response === 'object' && 'success' in response) {
          const responseObj = response as { success: boolean; data?: Record<string, unknown>; error?: string }
          if (responseObj.success) {
            if (responseObj.data?.method === 'highlight') {
              toast.success('Extension icon highlighted! Please click the EazyNet icon in your browser toolbar.')
            }
            // No toast for successful popup opening - action is done
          } else {
            toast.error(`Extension error: ${responseObj.error || 'Unknown error'}`)
          }
        } else {
          // No response or invalid response
          toast.success('Press Ctrl+Shift+E to open the EazyNet extension, or click the extension icon in your browser toolbar.')
        }
      })
    } else {
      // Chrome runtime not available
      console.log('Chrome runtime not available')
      toast.success('Press Ctrl+Shift+E to open the EazyNet extension, or click the extension icon in your browser toolbar.')
    }
  }

  const actions = [
    {
      title: "Open Extension",
      description: "Launch EazyNet tab manager (Ctrl+Shift+E)",
      icon: <Globe className="h-5 w-5" />,
      action: openExtension
    },
    {
      title: "Search Tabs",
      description: "Find tabs across all windows",
      icon: <Search className="h-5 w-5" />,
      action: openExtension
    },
    {
      title: "Sync Settings",
      description: "Update extension preferences (Coming Soon)",
      icon: <Settings className="h-5 w-5" />,
      action: () => {
        toast.success('Sync Settings feature is currently under development. This will allow you to synchronize your extension preferences across devices.')
      }
    },
    {
      title: "Export Data",
      description: "Download your tab data (Coming Soon)",
      icon: <Download className="h-5 w-5" />,
      action: () => {
        toast.success('Export Data feature is coming soon. This will allow you to export your tab groups and settings for backup or migration purposes.')
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