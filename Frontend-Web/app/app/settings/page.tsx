"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Shield, Music2, Download, LogOut, Upload, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [audioQuality, setAudioQuality] = useState("high")
  const [volume, setVolume] = useState([80])
  const [notifications, setNotifications] = useState({
    newReleases: true,
    playlistUpdates: true,
    artistUpdates: false,
    promotions: false,
  })

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <Tabs defaultValue="account" className="space-y-8">
          <TabsList className="bg-rave-dark-card border-rave-dark-border">
            <TabsTrigger value="account" className="data-[state=active]:bg-rave-accent">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-rave-accent">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-rave-accent">
              <Shield className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="playback" className="data-[state=active]:bg-rave-accent">
              <Music2 className="h-4 w-4 mr-2" />
              Playback
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="bg-rave-dark-card border-rave-dark-border">
              <CardHeader>
                <CardTitle className="text-white">Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                    <AvatarFallback className="bg-rave-accent text-white text-xl">UN</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button className="bg-rave-accent hover:bg-rave-accent-hover">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-gray-400 text-sm">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-200">
                      Display Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue="User Name"
                      className="bg-rave-dark-surface border-rave-dark-border text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-200">
                      Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue="username"
                      className="bg-rave-dark-surface border-rave-dark-border text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="user@example.com"
                      className="bg-rave-dark-surface border-rave-dark-border text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-200">
                      Phone (optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="border-rave-dark-border text-gray-300 hover:text-white">
                  Cancel
                </Button>
                <Button className="bg-rave-accent hover:bg-rave-accent-hover">Save Changes</Button>
              </CardFooter>
            </Card>

            <Card className="bg-rave-dark-card border-rave-dark-border">
              <CardHeader>
                <CardTitle className="text-white">Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-gray-200">
                      Current Password
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500"
                    />
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-gray-200">
                        New Password
                      </Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-200">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="bg-rave-dark-surface border-rave-dark-border text-white placeholder-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="border-rave-dark-border text-gray-300 hover:text-white">
                  Cancel
                </Button>
                <Button className="bg-rave-accent hover:bg-rave-accent-hover">Update Password</Button>
              </CardFooter>
            </Card>

            <Card className="bg-rave-dark-card border-rave-dark-border">
              <CardHeader>
                <CardTitle className="text-white">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border border-red-900/30 bg-red-950/10 rounded-md">
                  <div>
                    <h3 className="text-red-400 font-medium">Delete Account</h3>
                    <p className="text-gray-400 text-sm">Permanently delete your account and all associated data</p>
                  </div>
                  <Button variant="destructive" className="bg-red-900 hover:bg-red-800">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-rave-dark-card border-rave-dark-border">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
                <CardDescription>Manage how we contact you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">New Releases</Label>
                      <p className="text-gray-400 text-sm">Get notified when artists you follow release new music</p>
                    </div>
                    <Switch
                      checked={notifications.newReleases}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, newReleases: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Playlist Updates</Label>
                      <p className="text-gray-400 text-sm">Get notified when playlists you follow are updated</p>
                    </div>
                    <Switch
                      checked={notifications.playlistUpdates}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, playlistUpdates: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Artist Updates</Label>
                      <p className="text-gray-400 text-sm">Get notified about news from artists you follow</p>
                    </div>
                    <Switch
                      checked={notifications.artistUpdates}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, artistUpdates: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Promotions & Offers</Label>
                      <p className="text-gray-400 text-sm">Get notified about special offers and promotions</p>
                    </div>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, promotions: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-rave-accent hover:bg-rave-accent-hover">Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-rave-dark-card border-rave-dark-border">
              <CardHeader>
                <CardTitle className="text-white">Privacy Settings</CardTitle>
                <CardDescription>Manage your privacy preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Private Session</Label>
                      <p className="text-gray-400 text-sm">
                        Listen anonymously. Your activity won't be shared with followers.
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Public Profile</Label>
                      <p className="text-gray-400 text-sm">Allow others to see your profile and listening activity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Data Collection</Label>
                      <p className="text-gray-400 text-sm">Allow us to collect usage data to improve your experience</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-rave-accent hover:bg-rave-accent-hover">Save Privacy Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Playback Tab */}
          <TabsContent value="playback" className="space-y-6">
            <Card className="bg-rave-dark-card border-rave-dark-border">
              <CardHeader>
                <CardTitle className="text-white">Audio Quality</CardTitle>
                <CardDescription>Manage your audio playback settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="audio-quality" className="text-gray-200">
                      Streaming Quality
                    </Label>
                    <Select value={audioQuality} onValueChange={setAudioQuality}>
                      <SelectTrigger className="bg-rave-dark-surface border-rave-dark-border text-white">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent className="bg-rave-dark-card border-rave-dark-border">
                        <SelectItem value="low">Low (96 kbps)</SelectItem>
                        <SelectItem value="normal">Normal (160 kbps)</SelectItem>
                        <SelectItem value="high">High (320 kbps)</SelectItem>
                        <SelectItem value="lossless">Lossless (1411 kbps)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-gray-400 text-sm">Higher quality uses more data</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="download-quality" className="text-gray-200">
                      Download Quality
                    </Label>
                    <Select defaultValue="high">
                      <SelectTrigger className="bg-rave-dark-surface border-rave-dark-border text-white">
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent className="bg-rave-dark-card border-rave-dark-border">
                        <SelectItem value="normal">Normal (160 kbps)</SelectItem>
                        <SelectItem value="high">High (320 kbps)</SelectItem>
                        <SelectItem value="lossless">Lossless (1411 kbps)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-gray-400 text-sm">Higher quality uses more storage</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Normalize Volume</Label>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-gray-400 text-sm">Set the same volume level for all tracks</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-200">Default Volume</Label>
                    <div className="flex items-center gap-4">
                      <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
                      <span className="text-white w-8 text-right">{volume}%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Crossfade</Label>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-gray-400 text-sm">Allow songs to blend into each other</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Autoplay</Label>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-gray-400 text-sm">Continue playing similar songs when your music ends</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-rave-accent hover:bg-rave-accent-hover">Save Audio Settings</Button>
              </CardFooter>
            </Card>

            <Card className="bg-rave-dark-card border-rave-dark-border">
              <CardHeader>
                <CardTitle className="text-white">Downloads</CardTitle>
                <CardDescription>Manage your offline music</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white">Download over Cellular</Label>
                      <p className="text-gray-400 text-sm">Allow downloads using mobile data</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="p-4 border border-rave-dark-border rounded-md bg-rave-dark-surface">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">Storage</h3>
                      <span className="text-gray-400 text-sm">2.4 GB used</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
                      <div className="bg-rave-accent h-2.5 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    <p className="text-gray-400 text-sm">8 GB available</p>
                  </div>

                  <Button variant="outline" className="border-rave-dark-border text-gray-300 hover:text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Manage Downloads
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-8 border-t border-rave-dark-border text-center">
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
