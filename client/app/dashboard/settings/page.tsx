"use client"

import { useState } from "react"
import { Bell, Globe, Lock, Mail, Save, Shield, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  return (
    <div className="flex flex-col gap-10 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Profile Information</CardTitle>
              <CardDescription>Update your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your name" defaultValue="Venkatesh R" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Your email" defaultValue="venkatesh@nirnay.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" placeholder="Your organization" defaultValue="Bannari Amman Institute of Technology" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Your role" defaultValue="ML developer" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  className="min-h-[100px]"
                  defaultValue="your bio here"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="ist">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">Indian Standard Time (IST)</SelectItem>
                      <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                      <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <RadioGroup defaultValue="light" className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system">System</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-view">Compact View</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                  </div>
                  <Switch id="compact-view" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-save">Auto-Save Reports</Label>
                    <p className="text-sm text-muted-foreground">Automatically save analysis reports</p>
                  </div>
                  <Switch id="auto-save" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Notification Settings</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Analysis Completion</p>
                        <p className="text-sm text-muted-foreground">Receive an email when analysis is complete</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">System Updates</p>
                        <p className="text-sm text-muted-foreground">Receive updates about system changes</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Analysis Alerts</p>
                        <p className="text-sm text-muted-foreground">Receive alerts for important findings</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">System Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive system notifications</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
                {isSaving ? "Saving..." : "Save Notification Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Analysis Settings</CardTitle>
              <CardDescription>Configure how content is analyzed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="default-language">Default Analysis Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="default-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="confidence-threshold">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High (90%+)</SelectItem>
                      <SelectItem value="medium">Medium (75%+)</SelectItem>
                      <SelectItem value="low">Low (50%+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source-preference">Source Preference</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="source-preference">
                      <SelectValue placeholder="Select sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="gov">Government Sources</SelectItem>
                      <SelectItem value="academic">Academic Sources</SelectItem>
                      <SelectItem value="news">News Sources</SelectItem>
                      <SelectItem value="fact-check">Fact-Checking Organizations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-format">Default Report Format</Label>
                  <Select defaultValue="detailed">
                    <SelectTrigger id="report-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="executive">Executive Brief</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-analyze">Automatic Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically analyze new content from trusted sources
                    </p>
                  </div>
                  <Switch id="auto-analyze" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="archive-results">Archive Results</Label>
                    <p className="text-sm text-muted-foreground">Save analysis results for future reference</p>
                  </div>
                  <Switch id="archive-results" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="deep-analysis">Deep Analysis</Label>
                    <p className="text-sm text-muted-foreground">Perform more thorough analysis (takes longer)</p>
                  </div>
                  <Switch id="deep-analysis" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
                {isSaving ? "Saving..." : "Save Analysis Settings"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">API Integration</CardTitle>
              <CardDescription>Configure API access for external systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type="password"
                    value="••••••••••••••••••••••••••••••"
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline">Regenerate</Button>
                  <Button variant="outline">Copy</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use this key to authenticate API requests from external systems
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="api-access">Enable API Access</Label>
                    <p className="text-sm text-muted-foreground">Allow external systems to access the API</p>
                  </div>
                  <Switch id="api-access" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="webhook">Enable Webhooks</Label>
                    <p className="text-sm text-muted-foreground">
                      Send analysis results to external systems via webhooks
                    </p>
                  </div>
                  <Switch id="webhook" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
                {isSaving ? "Saving..." : "Save API Settings"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="two-factor" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Automatically log out after period of inactivity</p>
                  </div>
                  <Switch id="session-timeout" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-length">Session Length</Label>
                <Select defaultValue="60">
                  <SelectTrigger id="session-length">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="240">4 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
                {isSaving ? "Saving..." : "Update Security Settings"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Login History</CardTitle>
              <CardDescription>Recent account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-orange-100 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">New Delhi, India</p>
                      <p className="text-sm text-muted-foreground">Today, 10:30 AM</p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">Current Session</div>
                </div>

                <div className="flex items-center justify-between py-2 border-t">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium">New Delhi, India</p>
                      <p className="text-sm text-muted-foreground">Yesterday, 3:45 PM</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Chrome on Windows</div>
                </div>

                <div className="flex items-center justify-between py-2 border-t">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium">Mumbai, India</p>
                      <p className="text-sm text-muted-foreground">March 22, 2023, 9:15 AM</p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Safari on macOS</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="ghost" size="sm" className="w-full">
                View Full Login History
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

