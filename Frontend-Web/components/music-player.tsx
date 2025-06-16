"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Repeat, Shuffle } from "lucide-react"
import Image from "next/image"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [progress, setProgress] = useState([30])

  const currentSong = {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    image: "/placeholder.svg?height=56&width=56",
    duration: "3:20",
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-rave-dark-surface border-t border-rave-dark-border p-4">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Current Song Info */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="relative w-14 h-14 rounded-md overflow-hidden bg-rave-dark-card">
            <Image
              src={currentSong.image || "/placeholder.svg"}
              alt={`${currentSong.title} by ${currentSong.artist}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-white font-medium truncate">{currentSong.title}</h4>
            <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
          </div>
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
          <div className="flex items-center gap-4">
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-200 rounded-full w-8 h-8"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-gray-400">1:23</span>
            <Slider value={progress} onValueChange={setProgress} max={100} step={1} className="flex-1" />
            <span className="text-xs text-gray-400">{currentSong.duration}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-24" />
        </div>
      </div>
    </div>
  )
}
