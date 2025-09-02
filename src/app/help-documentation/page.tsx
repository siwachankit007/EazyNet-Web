"use client"

import React from "react"
import { Navigation } from "@/components/navigation"
import  Footer  from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, FolderOpen, Settings, Keyboard, Chrome } from "lucide-react"

export default function HelpDocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
         
          <h1 className="text-4xl font-bold text-white mb-4">EazyNet Help & Documentation</h1>
          <p className="text-white/80 text-lg">
            Complete guide to using EazyNet tab manager extension
          </p>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li><a href="#getting-started" className="text-blue-600 hover:underline">1. Getting Started</a></li>
              <li><a href="#installation" className="text-blue-600 hover:underline">2. Installation</a></li>
              <li><a href="#keyboard-shortcuts" className="text-blue-600 hover:underline">3. Keyboard Shortcuts</a></li>
              <li><a href="#features" className="text-blue-600 hover:underline">4. Features Overview</a></li>
              <li><a href="#ai-suggestions" className="text-blue-600 hover:underline">5. AI-Powered Suggestions</a></li>
              <li><a href="#tab-grouping" className="text-blue-600 hover:underline">6. Tab Grouping</a></li>
              <li><a href="#search-tabs" className="text-blue-600 hover:underline">7. Search Tabs</a></li>
              <li><a href="#settings" className="text-blue-600 hover:underline">8. Settings & Preferences</a></li>
              <li><a href="#troubleshooting" className="text-blue-600 hover:underline">9. Troubleshooting</a></li>
              <li><a href="#faq" className="text-blue-600 hover:underline">10. Frequently Asked Questions</a></li>
            </ul>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm" id="getting-started">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Chrome className="h-5 w-5 mr-2" />
              1. Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              EazyNet is a powerful Chrome extension designed to help you organize and manage your browser tabs efficiently. 
              It automatically groups tabs by domain and provides powerful search capabilities to find any tab across all windows.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Benefits:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Automatic tab grouping by domain</li>
                <li>Instant search across all tabs</li>
                <li>Keyboard shortcuts for quick access</li>
                <li>Clean and intuitive interface</li>
                <li>Works across multiple browser windows</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Installation */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm" id="installation">
          <CardHeader>
            <CardTitle>2. Installation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Step 1: Install from Chrome Web Store</h4>
                <p className="mb-2">Visit the EazyNet extension page on the Chrome Web Store:</p>
                <Button asChild>
                  <a href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc" target="_blank" rel="noopener noreferrer">
                    Install EazyNet Extension
                  </a>
                </Button>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 2: Pin the Extension</h4>
                <p>After installation, click the puzzle piece icon in your browser toolbar and pin EazyNet for easy access.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Step 3: Grant Permissions</h4>
                <p>When prompted, allow EazyNet to access your tabs for grouping and search functionality.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm" id="keyboard-shortcuts">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Keyboard className="h-5 w-5 mr-2" />
              3. Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Open Extension</h4>
                  <p className="text-sm text-gray-600">Ctrl + Shift + E</p>
                  <p className="text-xs text-gray-500 mt-1">Quickly open the EazyNet interface</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Search Tabs</h4>
                  <p className="text-sm text-gray-600">Ctrl + Shift + Y</p>
                  <p className="text-xs text-gray-500 mt-1">Group tabs by domain</p>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> These shortcuts can be customized in the extension settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm" id="features">
          <CardHeader>
            <CardTitle>4. Features Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FolderOpen className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Automatic Tab Grouping</h4>
                    <p className="text-sm text-gray-600">Tabs are automatically grouped by domain for better organization</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Search className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Powerful Search</h4>
                    <p className="text-sm text-gray-600">Search across all tabs in all windows instantly</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 text-purple-500 mt-1 text-lg">🤖</div>
                  <div>
                    <h4 className="font-semibold">AI-Powered Suggestions <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Pro</span></h4>
                    <p className="text-sm text-gray-600">Get intelligent recommendations for tab organization and productivity</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Settings className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Customizable Settings</h4>
                    <p className="text-sm text-gray-600">Adjust grouping rules and search preferences</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Chrome className="h-5 w-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Cross-Window Support</h4>
                    <p className="text-sm text-gray-600">Manage tabs across multiple browser windows</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 text-blue-500 mt-1 text-lg">💾</div>
                  <div>
                    <h4 className="font-semibold">Session Management <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Pro</span></h4>
                    <p className="text-sm text-gray-600">Save and restore your tab sessions for seamless workflow</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI-Powered Suggestions */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm" id="ai-suggestions">
          <CardHeader>
            <CardTitle>5. AI-Powered Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              EazyNet uses advanced AI algorithms to provide intelligent suggestions for your tabs. 
              It analyzes your browsing history and current tabs to offer relevant and context-aware suggestions.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">How It Works:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Analyzes your recent tab usage</li>
                <li>Identifies patterns and preferences</li>
                <li>Generates relevant suggestions for your current context</li>
                <li>Helps you discover new tabs to open</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tab Grouping */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm" id="tab-grouping">
          <CardHeader>
            <CardTitle>6. Tab Grouping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              EazyNet automatically groups your tabs by domain to keep your browser organized. 
              This helps you quickly identify related tabs and reduces visual clutter.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">How It Works:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Tabs from the same domain are grouped together</li>
                <li>Groups are color-coded for easy identification</li>
                <li>You can collapse/expand groups to save space</li>
                <li>Groups update automatically as you open/close tabs</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Customization Options:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Choose which domains to group together</li>
                <li>Set custom group colors</li>
                <li>Configure auto-collapse behavior</li>
                <li>Exclude specific domains from grouping</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Search Tabs */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm" id="search-tabs">
          <CardHeader>
            <CardTitle>7. Search Tabs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The search feature allows you to quickly find any tab across all your browser windows. 
              Simply open the extension and start typing to search.
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Search Options:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Title Search:</strong> Search by tab title</li>
                  <li><strong>URL Search:</strong> Search by website URL</li>
                  <li><strong>Domain Search:</strong> Search by website domain</li>
                  <li><strong>Fuzzy Search:</strong> Find partial matches</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Search Tips:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Use keyboard shortcuts to quickly open search</li>
                  <li>Results update in real-time as you type</li>
                  <li>Click on any result to switch to that tab</li>
                  <li>Use arrow keys to navigate results</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm" id="settings">
          <CardHeader>
            <CardTitle>8. Settings & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Customize EazyNet to work exactly how you want it. Access settings through the extension popup.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Grouping Settings</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Enable/disable automatic grouping</li>
                  <li>Set grouping rules by domain</li>
                  <li>Choose group colors</li>
                  <li>Configure auto-collapse behavior</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Search Settings</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Set default search type</li>
                  <li>Configure search shortcuts</li>
                  <li>Choose search result display</li>
                  <li>Set search history options</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm" id="troubleshooting">
          <CardHeader>
            <CardTitle>9. Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold">Extension Not Working</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Check if the extension is enabled in Chrome</li>
                  <li>Try refreshing the page</li>
                  <li>Restart your browser</li>
                  <li>Reinstall the extension if needed</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold">Tabs Not Grouping</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Check grouping settings in extension</li>
                  <li>Ensure you have permission to access tabs</li>
                  <li>Try disabling and re-enabling the extension</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Search Not Working</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm mt-2">
                  <li>Make sure the extension popup is open</li>
                  <li>Check if you have tabs open</li>
                  <li>Try the keyboard shortcut Ctrl+Shift+E</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm" id="faq">
          <CardHeader>
            <CardTitle>10. Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Q: Does EazyNet work with other browsers?</h4>
              <p className="text-sm text-gray-600">A: Currently, EazyNet is only available for Google Chrome. We&apos;re working on support for other browsers.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Q: Can I disable automatic grouping?</h4>
              <p className="text-sm text-gray-600">A: Yes, you can disable automatic grouping in the extension settings and use manual grouping instead.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Q: Does EazyNet sync my data?</h4>
              <p className="text-sm text-gray-600">A: Currently, EazyNet processes data locally. Sync features are coming soon for Pro users.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Q: How do I report a bug?</h4>
              <p className="text-sm text-gray-600">A: Please contact us at eazynettabmanager@gmail.com with details about the issue you&apos;re experiencing.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Q: Is EazyNet free to use?</h4>
              <p className="text-sm text-gray-600">A: EazyNet offers a free version with basic features. Premium features are available with a Pro subscription.</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>
              Can&apos;t find what you&apos;re looking for? Contact our support team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <a href="mailto:eazynettabmanager@gmail.com">
                  Contact Support
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://chromewebstore.google.com/detail/pijkgnboinjefkploaonlbpgbnfgobpc" target="_blank" rel="noopener noreferrer">
                  Chrome Web Store
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
} 