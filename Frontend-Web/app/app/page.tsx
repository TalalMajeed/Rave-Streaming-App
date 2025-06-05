"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Play, MoreHorizontal, Heart } from "lucide-react"
import Image from "next/image"

const mockSongs = [
  { id: 1, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20" },
  { id: 2, title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", duration: "2:54" },
  { id: 3, title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", duration: "3:23" },
  { id: 4, title: "Good 4 U", artist: "Olivia Rodrigo", album: "SOUR", duration: "2:58" },
  { id: 5, title: "Stay", artist: "The Kid LAROI, Justin Bieber", album: "F*CK LOVE 3", duration: "2:21" },
]

export default function AppPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSongs = mockSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-rave-dark-card border-rave-dark-border text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Songs List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Songs"}
          </h2>

          <div className="space-y-2">
            {filteredSongs.map((song, index) => (
              <Card
                key={song.id}
                className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400 w-6 text-center">{index + 1}</div>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-rave-dark-surface">
                      <Image
                        src="/placeholder.svg?height=48&width=48"
                        alt={`${song.album} cover`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{song.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    </div>
                    <div className="hidden md:block text-gray-400 text-sm min-w-0 flex-1">{song.album}</div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <span className="text-gray-400 text-sm">{song.duration}</span>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSongs.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-400">No songs found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
