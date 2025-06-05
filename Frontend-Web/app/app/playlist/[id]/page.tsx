"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, Heart, MoreHorizontal, Clock, Download, Share2, Plus, UserPlus } from "lucide-react"
import Image from "next/image"

// Mock data for playlists
const playlists = {
  "1": {
    id: "1",
    title: "My Playlist #1",
    description: "Your favorite songs",
    owner: "Your Name",
    followers: 0,
    coverImage: "/placeholder.svg?height=300&width=300",
    songs: [
      {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:20",
        liked: true,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 2,
        title: "Watermelon Sugar",
        artist: "Harry Styles",
        album: "Fine Line",
        duration: "2:54",
        liked: false,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 3,
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: "3:23",
        liked: true,
        image: "/placeholder.svg?height=64&width=64",
      },
    ],
    isOwner: true,
  },
  "2": {
    id: "2",
    title: "Chill Vibes",
    description: "Relaxing music for any time",
    owner: "Your Name",
    followers: 5,
    coverImage: "/placeholder.svg?height=300&width=300",
    songs: [
      {
        id: 4,
        title: "Good Days",
        artist: "SZA",
        album: "Good Days",
        duration: "4:38",
        liked: true,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 5,
        title: "Circles",
        artist: "Post Malone",
        album: "Hollywood's Bleeding",
        duration: "3:35",
        liked: false,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 6,
        title: "Sunflower",
        artist: "Post Malone, Swae Lee",
        album: "Spider-Man: Into the Spider-Verse",
        duration: "2:38",
        liked: false,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 7,
        title: "Falling",
        artist: "Harry Styles",
        album: "Fine Line",
        duration: "4:00",
        liked: true,
        image: "/placeholder.svg?height=64&width=64",
      },
    ],
    isOwner: true,
  },
  "3": {
    id: "3",
    title: "Workout Mix",
    description: "High energy songs for the gym",
    owner: "Your Name",
    followers: 12,
    coverImage: "/placeholder.svg?height=300&width=300",
    songs: [
      {
        id: 8,
        title: "Physical",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: "3:41",
        liked: false,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 9,
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:20",
        liked: true,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 10,
        title: "Don't Start Now",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: "3:03",
        liked: false,
        image: "/placeholder.svg?height=64&width=64",
      },
    ],
    isOwner: true,
  },
  "4": {
    id: "4",
    title: "Road Trip Hits",
    description: "Perfect songs for long drives",
    owner: "Friend's Name",
    followers: 45,
    coverImage: "/placeholder.svg?height=300&width=300",
    songs: [
      {
        id: 11,
        title: "Heat Waves",
        artist: "Glass Animals",
        album: "Dreamland",
        duration: "3:58",
        liked: true,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 12,
        title: "Ride",
        artist: "Twenty One Pilots",
        album: "Blurryface",
        duration: "3:34",
        liked: false,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 13,
        title: "Counting Stars",
        artist: "OneRepublic",
        album: "Native",
        duration: "4:17",
        liked: true,
        image: "/placeholder.svg?height=64&width=64",
      },
    ],
    isOwner: false,
  },
}

export default function PlaylistPage() {
  const params = useParams()
  const playlistId = params.id as string
  const playlist = playlists[playlistId] || playlists["1"] // Fallback to first playlist if not found

  const [isPlaying, setIsPlaying] = useState(false)
  const [likedSongs, setLikedSongs] = useState<Record<number, boolean>>(
    Object.fromEntries(playlist.songs.map((song) => [song.id, song.liked])),
  )

  const toggleLike = (songId: number) => {
    setLikedSongs((prev) => ({
      ...prev,
      [songId]: !prev[songId],
    }))
  }

  const totalDuration = playlist.songs.reduce((total, song) => {
    const [minutes, seconds] = song.duration.split(":").map(Number)
    return total + minutes * 60 + seconds
  }, 0)

  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600)
    const minutes = Math.floor((totalDuration % 3600) / 60)
    const seconds = totalDuration % 60

    if (hours > 0) {
      return `${hours} hr ${minutes} min`
    }
    return `${minutes} min ${seconds} sec`
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-md overflow-hidden shadow-lg">
            <Image src={playlist.coverImage || "/placeholder.svg"} alt={playlist.title} fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-gray-400 uppercase text-sm font-medium">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white my-2">{playlist.title}</h1>
            <p className="text-gray-400 mb-4">{playlist.description}</p>
            <div className="flex items-center text-gray-400 text-sm">
              <span className="font-medium text-white">{playlist.owner}</span>
              <span className="mx-1">•</span>
              <span>
                {playlist.followers} {playlist.followers === 1 ? "follower" : "followers"}
              </span>
              <span className="mx-1">•</span>
              <span>
                {playlist.songs.length} songs, {formatTotalDuration()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            size="lg"
            className={`rounded-full ${isPlaying ? "bg-green-500 hover:bg-green-600" : "bg-rave-accent hover:bg-rave-accent-hover"}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>

          {playlist.isOwner ? (
            <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
              <Plus className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
              <Heart className="h-5 w-5" />
            </Button>
          )}

          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
            <Download className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
            <Share2 className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="songs" className="space-y-6">
          <TabsList className="bg-rave-dark-card border-rave-dark-border">
            <TabsTrigger value="songs" className="data-[state=active]:bg-rave-accent">
              Songs
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-rave-accent">
              About
            </TabsTrigger>
          </TabsList>

          {/* Songs Tab */}
          <TabsContent value="songs" className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-[auto_1fr_1fr_auto] md:grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-rave-dark-border text-gray-400 text-sm">
              <div className="w-6 text-center">#</div>
              <div>Title</div>
              <div className="hidden md:block">Album</div>
              <div>Date Added</div>
              <div className="flex justify-end">
                <Clock className="h-4 w-4" />
              </div>
            </div>

            {/* Songs List */}
            <div className="space-y-1">
              {playlist.songs.map((song, index) => (
                <div
                  key={song.id}
                  className="grid grid-cols-[auto_1fr_1fr_auto] md:grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2 rounded-md hover:bg-rave-dark-surface group"
                >
                  <div className="w-6 text-center flex items-center justify-center">
                    <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                    <Play className="h-4 w-4 text-white hidden group-hover:block" />
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      <Image src={song.image || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate">{song.title}</div>
                      <div className="text-gray-400 text-sm truncate">{song.artist}</div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center text-gray-400 text-sm truncate">{song.album}</div>
                  <div className="flex items-center text-gray-400 text-sm">2 days ago</div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`${likedSongs[song.id] ? "text-green-500" : "text-gray-400 opacity-0 group-hover:opacity-100"} hover:text-white transition-opacity`}
                      onClick={() => toggleLike(song.id)}
                    >
                      <Heart className={`h-4 w-4 ${likedSongs[song.id] ? "fill-current" : ""}`} />
                    </Button>
                    <span className="text-gray-400 text-sm">{song.duration}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <div className="bg-rave-dark-card border border-rave-dark-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">About this playlist</h3>
              <p className="text-gray-400 mb-6">{playlist.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-rave-dark-surface flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Created by {playlist.owner}</p>
                  <p className="text-gray-400 text-sm">on May 15, 2024</p>
                </div>
              </div>

              <div className="border-t border-rave-dark-border pt-4 mt-4">
                <p className="text-gray-400 text-sm">
                  {playlist.followers} {playlist.followers === 1 ? "follower" : "followers"} • {playlist.songs.length}{" "}
                  songs, {formatTotalDuration()}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
