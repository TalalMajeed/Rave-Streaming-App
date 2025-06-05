"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Heart, MoreHorizontal, Clock, TrendingUp, Sparkles } from "lucide-react"
import Image from "next/image"

const featuredPlaylists = [
  {
    id: 1,
    title: "Today's Top Hits",
    description: "The most played songs right now",
    image: "/placeholder.svg?height=200&width=200",
    songs: 50,
  },
  {
    id: 2,
    title: "Chill Vibes",
    description: "Relax and unwind with these mellow tracks",
    image: "/placeholder.svg?height=200&width=200",
    songs: 75,
  },
  {
    id: 3,
    title: "Workout Mix",
    description: "High-energy songs to fuel your workout",
    image: "/placeholder.svg?height=200&width=200",
    songs: 40,
  },
  {
    id: 4,
    title: "Late Night Jazz",
    description: "Smooth jazz for those quiet evening moments",
    image: "/placeholder.svg?height=200&width=200",
    songs: 60,
  },
]

const recommendedSongs = [
  {
    id: 1,
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: "2:47",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 2,
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: "3:58",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 3,
    title: "Anti-Hero",
    artist: "Taylor Swift",
    album: "Midnights",
    duration: "3:20",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 4,
    title: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    duration: "3:20",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: 5,
    title: "Unholy",
    artist: "Sam Smith ft. Kim Petras",
    album: "Gloria",
    duration: "2:36",
    image: "/placeholder.svg?height=64&width=64",
  },
]

const recentlyPlayed = [
  {
    id: 1,
    title: "Vampire",
    artist: "Olivia Rodrigo",
    image: "/placeholder.svg?height=160&width=160",
  },
  {
    id: 2,
    title: "Cruel Summer",
    artist: "Taylor Swift",
    image: "/placeholder.svg?height=160&width=160",
  },
  {
    id: 3,
    title: "Shivers",
    artist: "Ed Sheeran",
    image: "/placeholder.svg?height=160&width=160",
  },
  {
    id: 4,
    title: "Stay",
    artist: "The Kid LAROI",
    image: "/placeholder.svg?height=160&width=160",
  },
  {
    id: 5,
    title: "Industry Baby",
    artist: "Lil Nas X",
    image: "/placeholder.svg?height=160&width=160",
  },
]

export default function HomePage() {
  const currentHour = new Date().getHours()
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning"
    if (currentHour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Greeting Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{getGreeting()}</h1>
          <p className="text-gray-400">Discover new music tailored just for you</p>
        </div>

        {/* Recently Played */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-rave-accent" />
            <h2 className="text-xl font-semibold text-white">Recently Played</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentlyPlayed.map((item) => (
              <Card
                key={item.id}
                className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-all duration-200 cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div className="relative mb-3">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={160}
                      height={160}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <Button
                      size="sm"
                      className="absolute bottom-2 right-2 bg-rave-accent hover:bg-rave-accent-hover rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-medium text-white text-sm truncate">{item.title}</h3>
                  <p className="text-gray-400 text-xs truncate">{item.artist}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommended for You */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-rave-accent" />
            <h2 className="text-xl font-semibold text-white">Recommended for You</h2>
          </div>
          <div className="space-y-2">
            {recommendedSongs.map((song, index) => (
              <Card
                key={song.id}
                className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-colors group"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-400 w-6 text-center text-sm">{index + 1}</div>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden">
                      <Image
                        src={song.image || "/placeholder.svg"}
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
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <span className="text-gray-400 text-sm">{song.duration}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Playlists */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-rave-accent" />
            <h2 className="text-xl font-semibold text-white">Featured Playlists</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlaylists.map((playlist) => (
              <Card
                key={playlist.id}
                className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-all duration-200 cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <Image
                      src={playlist.image || "/placeholder.svg"}
                      alt={playlist.title}
                      width={200}
                      height={200}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <Button
                      size="sm"
                      className="absolute bottom-2 right-2 bg-rave-accent hover:bg-rave-accent-hover rounded-full w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{playlist.title}</h3>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{playlist.description}</p>
                  <p className="text-gray-500 text-xs">{playlist.songs} songs</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
