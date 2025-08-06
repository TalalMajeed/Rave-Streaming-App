"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSongQueue } from "@/contexts/SongQueueContext"
import { apiService } from "@/lib/api"
import { Download, Heart, MoreHorizontal, Pause, Play, Plus, Share2 } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PlaylistPage() {
  const params = useParams()
  const router = useRouter()
  const playlistId = params.id as string
  const { playSongById, currentSong, state, addToQueue, clearQueue } = useSongQueue()
  
  const [playlist, setPlaylist] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likedSongs, setLikedSongs] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!playlistId) return
      
      setLoading(true)
      setError(null)
      
      try {
        const data = await apiService.getPlaylist(playlistId)
        
        // Fetch full song details for each song ID
        if (data.songs && data.songs.length > 0) {
          const songDetails = await Promise.all(
            data.songs.map(async (songId: string) => {
              try {
                // Get song details by webId (external song ID)
                const songDetail: any = await apiService.getSongByWebId(songId)
                
                if (!songDetail) {
                  console.warn(`Song not found for ID: ${songId}`);
                  return { 
                    id: songId, 
                    name: 'Song Not Available', 
                    artist: 'Unknown Artist', 
                    album: 'Unknown Album', 
                    image: '/placeholder.svg' 
                  }
                }
                
                // Ensure the song has the correct structure for the Song interface
                return {
                  id: songDetail.webId || songDetail.id || songId, // Always use webId for external API calls
                  name: songDetail.name || songDetail.title || 'Unknown Song',
                  artist: songDetail.artist || 'Unknown Artist',
                  album: songDetail.album || 'Unknown Album',
                  image: songDetail.image || songDetail.photo || '/placeholder.svg'
                }
              } catch (error) {
                console.error(`Error fetching song details for ${songId}:`, error)
                return { 
                  id: songId, 
                  name: 'Error Loading Song', 
                  artist: 'Unknown Artist', 
                  album: 'Unknown Album', 
                  image: '/placeholder.svg' 
                }
              }
            })
          )
          
          data.songs = songDetails
        }
        
        setPlaylist(data)
        // Initialize liked songs state
        const initialLikedState = Object.fromEntries(
          (data.songs || []).map((song: any) => [song.id, false])
        )
        setLikedSongs(initialLikedState)
      } catch (err: any) {
        setError(err.message || "Failed to load playlist")
        console.error("Error fetching playlist:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylist()
  }, [playlistId])

  const toggleLike = async (songId: string) => {
    try {
      const isCurrentlyLiked = likedSongs[songId];
      
      if (isCurrentlyLiked) {
        // Unlike the song
        await apiService.removeFromLikedSongs(songId);
        setLikedSongs((prev) => ({
          ...prev,
          [songId]: false,
        }));
        // Notify other components that a song was unliked
        window.dispatchEvent(new CustomEvent('songUnliked'));
      } else {
        // Like the song
        await apiService.addToLikedSongs(songId);
        setLikedSongs((prev) => ({
          ...prev,
          [songId]: true,
        }));
        // Notify other components that a song was liked
        window.dispatchEvent(new CustomEvent('songLiked'));
      }
    } catch (error) {
      console.error('Error toggling like status:', error);
      alert('Failed to update like status');
    }
  }

  const formatTotalDuration = () => {
    if (!playlist?.songs?.length) return "0 min"
    
    const totalDuration = playlist.songs.reduce((total: number, song: any) => {
      // Handle different duration formats
      if (typeof song.duration === 'string') {
        const [minutes, seconds] = song.duration.split(":").map(Number)
        return total + (minutes * 60) + (seconds || 0)
      }
      return total + (song.duration || 0)
    }, 0)

    const hours = Math.floor(totalDuration / 3600)
    const minutes = Math.floor((totalDuration % 3600) / 60)
    const seconds = totalDuration % 60

    if (hours > 0) {
      return `${hours} hr ${minutes} min`
    }
    return `${minutes} min ${seconds} sec`
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-gray-700 rounded-md"></div>
              <div className="flex flex-col justify-end space-y-4">
                <div className="h-4 bg-gray-700 rounded w-20"></div>
                <div className="h-12 bg-gray-700 rounded w-64"></div>
                <div className="h-4 bg-gray-700 rounded w-48"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !playlist) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Playlist Not Found</h1>
          <p className="text-gray-400 mb-6">{error || "The playlist you're looking for doesn't exist."}</p>
          <Button onClick={() => router.push('/app')} className="bg-rave-accent hover:bg-rave-accent-hover">
            Go Back Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-md overflow-hidden shadow-lg">
            <Image 
              src={playlist.photo || "/placeholder.svg"} 
              alt={playlist.name} 
              fill 
              className="object-cover" 
            />
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-gray-400 uppercase text-sm font-medium">Playlist</p>
            <h1 className="text-4xl md:text-6xl font-bold text-white my-2">{playlist.name}</h1>
            <p className="text-gray-400 mb-4">{playlist.description || "No description"}</p>
            <div className="flex items-center text-gray-400 text-sm">
              <span className="font-medium text-white">{playlist.creator?.name || "Unknown Artist"}</span>
              <span className="mx-1">•</span>
              <span>
                {playlist.songs?.length || 0} songs, {formatTotalDuration()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            size="lg"
            className={`rounded-full ${state.controls.isPlaying ? "bg-green-500 hover:bg-green-600" : "bg-rave-accent hover:bg-rave-accent-hover"}`}
            onClick={() => {
              if (playlist.songs && playlist.songs.length > 0) {
                const firstSong = playlist.songs[0];
                playSongById(firstSong.id || firstSong._id, firstSong);
              }
            }}
          >
            {state.controls.isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
            {state.controls.isPlaying ? "Pause" : "Play"}
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-rave-accent text-rave-accent hover:bg-rave-accent hover:text-white"
            onClick={() => {
              if (playlist.songs && playlist.songs.length > 0) {
                // Clear current queue and add all playlist songs
                clearQueue();
                playlist.songs.forEach((song: any) => {
                  addToQueue(song);
                });
                // Play the first song
                const firstSong = playlist.songs[0];
                playSongById(firstSong.id || firstSong._id, firstSong);
              }
            }}
          >
            <Play className="h-5 w-5 mr-2" />
            Play All
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full text-gray-400 hover:text-white">
            <Plus className="h-5 w-5" />
          </Button>

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

          <TabsContent value="songs" className="space-y-4">
            {playlist.songs && playlist.songs.length > 0 ? (
              <div className="space-y-2">
                {playlist.songs.map((song: any, index: number) => (
                  <div
                    key={song.id || song._id || `song-${index}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-rave-dark-card transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-gray-400 text-sm w-8">{index + 1}</span>
                      <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-rave-dark-surface border border-rave-dark-border relative">
                        <img 
                          src={song.image || song.photo || "/placeholder.svg"} 
                          alt={song.name || song.title} 
                          className="object-cover w-full h-full" 
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-white font-medium truncate">
                          {song.name || song.title}
                        </span>
                        <span className="text-gray-400 text-sm truncate">
                          {song.artist}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                        onClick={() => {
                          console.log('Playing song from playlist:', song);
                          playSongById(song.id, song);
                        }}
                      >
                        {currentSong?.id === song.id && state.controls.isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                        onClick={() => toggleLike(song.id)}
                      >
                        <Heart 
                          className={`h-4 w-4 ${likedSongs[song.id] ? 'fill-red-500 text-red-500' : ''}`} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-gray-400 text-sm">
                      {song.duration || "0:00"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">This playlist is empty</p>
                <Button className="bg-rave-accent hover:bg-rave-accent-hover">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Songs
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <div className="bg-rave-dark-card rounded-lg p-6 border border-rave-dark-border">
              <h3 className="text-lg font-semibold text-white mb-4">About this playlist</h3>
              <p className="text-gray-400 mb-4">
                {playlist.description || "No description available for this playlist."}
              </p>
              <div className="text-sm text-gray-500">
                <p>Created by: {playlist.creator?.name || "Unknown"}</p>
                <p>Created on: {new Date(playlist.createdAt).toLocaleDateString()}</p>
                <p>Total songs: {playlist.songs?.length || 0}</p>
                <p>Duration: {formatTotalDuration()}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
