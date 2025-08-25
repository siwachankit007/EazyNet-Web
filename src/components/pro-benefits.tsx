import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Brain, Zap, Globe, Heart, Settings } from "lucide-react"
import { UpgradeButton } from "@/components/payment/upgrade-button"

export function ProBenefits() {
  const benefits = [
    {
      icon: <Brain className="h-5 w-5 text-purple-600" />,
      title: "Smart Subgrouping",
      description: "Group tabs by path for deep organization"
    },
    {
      icon: <Zap className="h-5 w-5 text-blue-600" />,
      title: "Auto Grouping",
      description: "Tabs grouped automatically by domain or path"
    },
    {
      icon: <Globe className="h-5 w-5 text-green-600" />,
      title: "Sync Across Devices",
      description: "Your groups and settings everywhere"
    },
    {
      icon: <Zap className="h-5 w-5 text-orange-600" />,
      title: "Faster Browser",
      description: "Tab group memory management"
    },
    {
      icon: <Heart className="h-5 w-5 text-red-600" />,
      title: "Priority Support",
      description: "Feature requests and more"
    },
    {
      icon: <Settings className="h-5 w-5 text-gray-600" />,
      title: "More Control",
      description: "Individual tab memory management"
    }
  ]

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-purple-600" />
          <span>Unlock Pro Benefits</span>
        </CardTitle>
        <CardDescription>
          Get advanced features and priority support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
              {benefit.icon}
              <div>
                <h4 className="font-medium text-sm">{benefit.title}</h4>
                <p className="text-xs text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <UpgradeButton 
          className="w-full bg-purple-600 hover:bg-purple-700"
          planType="pro"
          showProBadge={false}
        >
          Upgrade to Pro - $4.99/month
        </UpgradeButton>
        
        <p className="text-xs text-center text-gray-500">
          30-day money-back guarantee
        </p>
      </CardContent>
    </Card>
  )
}