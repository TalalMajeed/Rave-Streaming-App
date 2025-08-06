"use client";

import { CreatePlaylistModal } from "@/components/CreatePlaylistModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSongQueue } from "@/contexts/SongQueueContext";
import { apiService } from "@/lib/api";
import {
    Clock,
    Download,
    Filter,
    Grid3X3,
    Heart,
    List,
    MoreHorizontal,
    Pause,
    Play,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// This will be replaced with real data from API
const likedSongs = [];

const userPlaylists = [
    {
        id: 1,
        title: "My Playlist #1",
        description: "Your favorite songs",
        songCount: 23,
        image: "/placeholder.svg?height=200&width=200",
        isOwner: true,
    },
    {
        id: 2,
        title: "Chill Vibes",
        description: "Relaxing music for any time",
        songCount: 45,
        image: "/placeholder.svg?height=200&width=200",
        isOwner: true,
    },
    {
        id: 3,
        title: "Workout Mix",
        description: "High energy songs for the gym",
        songCount: 32,
        image: "/placeholder.svg?height=200&width=200",
        isOwner: true,
    },
    {
        id: 4,
        title: "Road Trip Hits",
        description: "Perfect songs for long drives",
        songCount: 67,
        image: "/placeholder.svg?height=200&width=200",
        isOwner: false,
    },
];

const recentlyPlayed = [
    {
        id: 1,
        title: "As It Was",
        artist: "Harry Styles",
        album: "Harry's House",
        duration: "2:47",
        playedAt: "2 hours ago",
        image: "/placeholder.svg?height=64&width=64",
    },
    {
        id: 2,
        title: "Heat Waves",
        artist: "Glass Animals",
        album: "Dreamland",
        duration: "3:58",
        playedAt: "5 hours ago",
        image: "/placeholder.svg?height=64&width=64",
    },
    {
        id: 3,
        title: "Anti-Hero",
        artist: "Taylor Swift",
        album: "Midnights",
        duration: "3:20",
        playedAt: "1 day ago",
        image: "/placeholder.svg?height=64&width=64",
    },
];

const downloadedSongs = [
    {
        id: 1,
        title: "Flowers",
        artist: "Miley Cyrus",
        album: "Endless Summer Vacation",
        duration: "3:20",
        size: "7.2 MB",
        image: "/placeholder.svg?height=64&width=64",
    },
    {
        id: 2,
        title: "Unholy",
        artist: "Sam Smith ft. Kim Petras",
        album: "Gloria",
        duration: "2:36",
        size: "5.8 MB",
        image: "/placeholder.svg?height=64&width=64",
    },
];

export default function LibraryPage() {
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [likedSongs, setLikedSongs] = useState<any[]>([]);
    const [likedSongsLoading, setLikedSongsLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState<any>(null);
    const [deleting, setDeleting] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = useState("playlists");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { playSongById, currentSong, state, addToQueue, clearQueue } = useSongQueue();

    // Handle URL parameter for tab
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'liked') {
            setActiveTab('liked');
        } else {
            setActiveTab('playlists');
        }
    }, [searchParams]);

    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const data = await apiService.getUserPlaylists();
            setPlaylists(data);
        } catch (err) {
            setPlaylists([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchLikedSongs = async () => {
        setLikedSongsLoading(true);
        try {
            const likedSongIds = await apiService.getLikedSongs();
            
            // Fetch song details for each liked song ID
            const songsWithDetails = await Promise.all(
                likedSongIds.map(async (songId) => {
                    try {
                        const songDetail = await apiService.getSongByWebId(songId);
                        if (songDetail) {
                            return {
                                id: (songDetail as any).webId || (songDetail as any).id || songId,
                                title: (songDetail as any).name || (songDetail as any).title || 'Unknown Song',
                                artist: (songDetail as any).artist || 'Unknown Artist',
                                album: (songDetail as any).album || 'Unknown Album',
                                duration: (songDetail as any).duration || "0:00",
                                dateAdded: "Recently",
                                image: (songDetail as any).image || (songDetail as any).photo || "/placeholder.svg?height=64&width=64",
                            };
                        } else {
                            // Fallback for songs that can't be found
                            return {
                                id: songId,
                                title: 'Song Not Available',
                                artist: 'Unknown Artist',
                                album: 'Unknown Album',
                                duration: "0:00",
                                dateAdded: "Recently",
                                image: "/placeholder.svg?height=64&width=64",
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching song details for ${songId}:`, error);
                        return {
                            id: songId,
                            title: 'Error Loading Song',
                            artist: 'Unknown Artist',
                            album: 'Unknown Album',
                            duration: "0:00",
                            dateAdded: "Recently",
                            image: "/placeholder.svg?height=64&width=64",
                        };
                    }
                })
            );
            
            setLikedSongs(songsWithDetails);
        } catch (err) {
            console.error("Error fetching liked songs:", err);
            setLikedSongs([]);
        } finally {
            setLikedSongsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
        fetchLikedSongs();
        
        // Listen for like/unlike events from other components
        const handleSongLiked = () => {
            fetchLikedSongs();
        };
        
        window.addEventListener('songLiked', handleSongLiked);
        window.addEventListener('songUnliked', handleSongLiked);
        
        return () => {
            window.removeEventListener('songLiked', handleSongLiked);
            window.removeEventListener('songUnliked', handleSongLiked);
        };
    }, []);

    const handleLikeToggle = async (songId: string) => {
        try {
            // Check if song is currently liked
            const isCurrentlyLiked = likedSongs.some(song => song.id === songId);
            
            if (isCurrentlyLiked) {
                // Unlike the song
                await apiService.removeFromLikedSongs(songId);
                window.dispatchEvent(new CustomEvent('songUnliked'));
            } else {
                // Like the song
                await apiService.addToLikedSongs(songId);
                window.dispatchEvent(new CustomEvent('songLiked'));
            }
            
            // Refresh the liked songs list
            fetchLikedSongs();
        } catch (error) {
            console.error('Error toggling like status:', error);
            alert('Failed to update like status');
        }
    };

    const handlePlaylistCreated = () => {
        setShowCreateModal(false);
        fetchPlaylists();
        // Notify other components that a playlist was created
        window.dispatchEvent(new CustomEvent('playlistCreated'));
    };

    // Placeholder recommended songs
    const recommendedSongs = [
        { id: 101, title: "Recommended Song 1", artist: "Artist A" },
        { id: 102, title: "Recommended Song 2", artist: "Artist B" },
        { id: 103, title: "Recommended Song 3", artist: "Artist C" },
    ];

    const handleSongToggle = (id: number) => {
        // This function is no longer needed as recommendedSongs is removed
    };

    const handleCreatePlaylist = () => {
        // TODO: Connect to backend
        // For now, just close modal and reset
        setShowCreateModal(false);
        // Optionally, show a toast/notification
    };

    const handleDeletePlaylist = async () => {
        if (!playlistToDelete) return;
        
        setDeleting(true);
        try {
            await apiService.deletePlaylist(playlistToDelete._id);
            setShowDeleteDialog(false);
            setPlaylistToDelete(null);
            // Refresh the playlist list
            fetchPlaylists();
            // Notify other components that a playlist was deleted
            window.dispatchEvent(new CustomEvent('playlistDeleted'));
        } catch (error) {
            console.error("Error deleting playlist:", error);
            alert("Failed to delete playlist");
        } finally {
            setDeleting(false);
        }
    };

    const openDeleteDialog = (playlist: any) => {
        setPlaylistToDelete(playlist);
        setShowDeleteDialog(true);
    };

    const filteredPlaylists = playlists.filter((playlist) =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Your Library
                        </h1>
                        <p className="text-gray-400">
                            Your music, playlists, and more
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search in your library..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-rave-dark-card border-rave-dark-border text-white placeholder-gray-400 w-64"
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                        >
                            <Filter className="h-4 w-4" />
                        </Button>
                        <div className="flex border border-rave-dark-border rounded-md">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode("grid")}
                                className={`rounded-r-none ${
                                    viewMode === "grid"
                                        ? "bg-rave-dark-surface text-white"
                                        : "text-gray-400"
                                }`}
                            >
                                <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setViewMode("list")}
                                className={`rounded-l-none ${
                                    viewMode === "list"
                                        ? "bg-rave-dark-surface text-white"
                                        : "text-gray-400"
                                }`}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(value) => {
                    setActiveTab(value);
                    if (value === 'liked') {
                        router.push('/app/library?tab=liked');
                    } else {
                        router.push('/app/library');
                    }
                }} className="space-y-6">
                    <TabsList className="bg-rave-dark-card border-rave-dark-border">
                        <TabsTrigger
                            value="playlists"
                            className="data-[state=active]:bg-rave-accent"
                        >
                            Playlists
                        </TabsTrigger>
                        <TabsTrigger
                            value="liked"
                            className="data-[state=active]:bg-rave-accent"
                        >
                            Liked Songs
                        </TabsTrigger>
                        <TabsTrigger
                            value="recent"
                            className="data-[state=active]:bg-rave-accent"
                        >
                            Recently Played
                        </TabsTrigger>
                        <TabsTrigger
                            value="downloads"
                            className="data-[state=active]:bg-rave-accent"
                        >
                            Downloads
                        </TabsTrigger>
                    </TabsList>

                    {/* Playlists Tab */}
                    <TabsContent value="playlists" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">
                                Your Playlists
                            </h2>
                            <Button className="bg-rave-accent hover:bg-rave-accent-hover" onClick={() => setShowCreateModal(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Playlist
                            </Button>
                            <CreatePlaylistModal open={showCreateModal} onOpenChange={setShowCreateModal} onCreate={handlePlaylistCreated} />
                        </div>

                        {loading ? (
                            <div className="text-gray-400 text-center py-12">Loading playlists...</div>
                        ) : viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPlaylists.map((playlist) => (
                                    <Card
                                        key={playlist._id}
                                        className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-all duration-200 cursor-pointer group"
                                        onClick={() => router.push(`/app/playlist/${playlist._id}`)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="relative mb-4">
                                                <Image
                                                    src={playlist.photo || "/placeholder.svg"}
                                                    alt={playlist.name}
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
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="absolute top-2 right-2 rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openDeleteDialog(playlist);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <h3 className="font-semibold text-white mb-1 truncate">
                                                {playlist.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                                                {playlist.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-gray-500 text-xs">
                                                    {playlist.songs?.length || 0} songs
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredPlaylists.map((playlist) => (
                                    <Card
                                        key={playlist._id}
                                        className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-colors group"
                                        onClick={() => router.push(`/app/playlist/${playlist._id}`)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                                    <Image
                                                        src={playlist.photo || "/placeholder.svg"}
                                                        alt={playlist.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-medium truncate">
                                                        {playlist.name}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm truncate">
                                                        {playlist.description}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        {playlist.songs?.length || 0} songs
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
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
                                                        className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteDialog(playlist);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Liked Songs Tab */}
                    <TabsContent value="liked" className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-md flex items-center justify-center">
                                <Heart className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Liked Songs
                                </h2>
                                <p className="text-gray-400">
                                    {likedSongsLoading ? "Loading..." : `${likedSongs.length} songs`}
                                </p>
                            </div>
                            {likedSongs.length > 0 && (
                                <Button 
                                    className="ml-auto bg-rave-accent hover:bg-rave-accent-hover"
                                    onClick={() => {
                                        if (likedSongs.length > 0) {
                                            clearQueue();
                                            likedSongs.forEach((song) => {
                                                addToQueue({
                                                    id: song.id,
                                                    name: song.title,
                                                    artist: song.artist,
                                                    album: song.album,
                                                    image: song.image
                                                });
                                            });
                                            const firstSong = likedSongs[0];
                                            playSongById(firstSong.id, {
                                                id: firstSong.id,
                                                name: firstSong.title,
                                                artist: firstSong.artist,
                                                album: firstSong.album,
                                                image: firstSong.image
                                            });
                                        }
                                    }}
                                >
                                    <Play className="h-4 w-4 mr-2" />
                                    Play All
                                </Button>
                            )}
                        </div>

                        {likedSongsLoading && (
                            <div className="space-y-2">
                                {[...Array(5)].map((_, index) => (
                                    <Card
                                        key={index}
                                        className="bg-rave-dark-card border-rave-dark-border"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 h-4 bg-gray-700 rounded animate-pulse" />
                                                <div className="w-12 h-12 bg-gray-700 rounded-md animate-pulse" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-gray-700 rounded animate-pulse" />
                                                    <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                        {!likedSongsLoading && likedSongs.length === 0 && (
                            <div className="text-center py-12">
                                <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">No liked songs yet</h3>
                                <p className="text-gray-400 mb-6">
                                    Start liking songs to see them here
                                </p>
                                <Button 
                                    className="bg-rave-accent hover:bg-rave-accent-hover"
                                    onClick={() => window.location.href = '/app/home'}
                                >
                                    Discover Music
                                </Button>
                            </div>
                        )}
                        {!likedSongsLoading && likedSongs.length > 0 && (
                            <div className="space-y-2">
                                {likedSongs.map((song, index) => (
                                <Card
                                    key={song.id}
                                    className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-colors group"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-gray-400 w-6 text-center text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                                <Image
                                                    src={
                                                        song.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`${song.album} cover`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-medium truncate">
                                                    {song.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm truncate">
                                                    {song.artist}
                                                </p>
                                            </div>
                                            <div className="hidden md:block text-gray-400 text-sm min-w-0 flex-1">
                                                {song.album}
                                            </div>
                                            <div className="hidden md:block text-gray-400 text-sm">
                                                {song.dateAdded}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => playSongById(song.id, {
                                                        id: song.id,
                                                        name: song.title,
                                                        artist: song.artist,
                                                        album: song.album,
                                                        image: song.image
                                                    })}
                                                >
                                                    {currentSong?.id === song.id && state.controls.isPlaying ? (
                                                        <Pause className="h-4 w-4" />
                                                    ) : (
                                                        <Play className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-green-500 hover:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => handleLikeToggle(song.id)}
                                                >
                                                    <Heart className="h-4 w-4 fill-current" />
                                                </Button>
                                                <span className="text-gray-400 text-sm">
                                                    {song.duration}
                                                </span>
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
                        )}
                    </TabsContent>

                    {/* Recently Played Tab */}
                    <TabsContent value="recent" className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-md flex items-center justify-center">
                                <Clock className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Recently Played
                                </h2>
                                <p className="text-gray-400">
                                    {recentlyPlayed.length} songs
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {recentlyPlayed.map((song, index) => (
                                <Card
                                    key={song.id}
                                    className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-colors group"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-gray-400 w-6 text-center text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                                <Image
                                                    src={
                                                        song.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`${song.album} cover`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-medium truncate">
                                                    {song.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm truncate">
                                                    {song.artist}
                                                </p>
                                            </div>
                                            <div className="hidden md:block text-gray-400 text-sm min-w-0 flex-1">
                                                {song.album}
                                            </div>
                                            <div className="hidden md:block text-gray-400 text-sm">
                                                {song.playedAt}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 text-sm">
                                                    {song.duration}
                                                </span>
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
                    </TabsContent>

                    {/* Downloads Tab */}
                    <TabsContent value="downloads" className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
                                <Download className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Downloaded Music
                                </h2>
                                <p className="text-gray-400">
                                    {downloadedSongs.length} songs • Available
                                    offline
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {downloadedSongs.map((song, index) => (
                                <Card
                                    key={song.id}
                                    className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-colors group"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-gray-400 w-6 text-center text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                                <Image
                                                    src={
                                                        song.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`${song.album} cover`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-medium truncate">
                                                    {song.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm truncate">
                                                    {song.artist}
                                                </p>
                                            </div>
                                            <div className="hidden md:block text-gray-400 text-sm min-w-0 flex-1">
                                                {song.album}
                                            </div>
                                            <div className="hidden md:block text-gray-400 text-sm">
                                                {song.size}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Download className="h-4 w-4 text-green-500" />
                                                <span className="text-gray-400 text-sm">
                                                    {song.duration}
                                                </span>
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
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && playlistToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-rave-dark-card border border-rave-dark-border rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Delete Playlist
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete "{playlistToDelete.name}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setPlaylistToDelete(null);
                                }}
                                disabled={deleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeletePlaylist}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
