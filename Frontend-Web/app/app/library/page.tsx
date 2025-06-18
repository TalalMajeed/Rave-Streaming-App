"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Play,
    Heart,
    MoreHorizontal,
    Search,
    Plus,
    Clock,
    Download,
    Grid3X3,
    List,
    Filter,
} from "lucide-react";
import Image from "next/image";

const likedSongs = [
    {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        duration: "3:20",
        dateAdded: "2 days ago",
        image: "/placeholder.svg?height=64&width=64",
    },
    {
        id: 2,
        title: "Watermelon Sugar",
        artist: "Harry Styles",
        album: "Fine Line",
        duration: "2:54",
        dateAdded: "1 week ago",
        image: "/placeholder.svg?height=64&width=64",
    },
    {
        id: 3,
        title: "Levitating",
        artist: "Dua Lipa",
        album: "Future Nostalgia",
        duration: "3:23",
        dateAdded: "2 weeks ago",
        image: "/placeholder.svg?height=64&width=64",
    },
];

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
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const filteredPlaylists = userPlaylists.filter((playlist) =>
        playlist.title.toLowerCase().includes(searchQuery.toLowerCase())
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
                <Tabs defaultValue="playlists" className="space-y-6">
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
                            <Button className="bg-rave-accent hover:bg-rave-accent-hover">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Playlist
                            </Button>
                        </div>

                        {viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredPlaylists.map((playlist) => (
                                    <Card
                                        key={playlist.id}
                                        className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-all duration-200 cursor-pointer group"
                                    >
                                        <CardContent className="p-4">
                                            <div className="relative mb-4">
                                                <Image
                                                    src={
                                                        playlist.image ||
                                                        "/placeholder.svg"
                                                    }
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
                                            <h3 className="font-semibold text-white mb-1 truncate">
                                                {playlist.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                                                {playlist.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-gray-500 text-xs">
                                                    {playlist.songCount} songs
                                                </p>
                                                {playlist.isOwner && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-gray-400 hover:text-white"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredPlaylists.map((playlist) => (
                                    <Card
                                        key={playlist.id}
                                        className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-colors group"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                                    <Image
                                                        src={
                                                            playlist.image ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={playlist.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-medium truncate">
                                                        {playlist.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm truncate">
                                                        {playlist.description}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">
                                                        {playlist.songCount}{" "}
                                                        songs
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
                                                    {playlist.isOwner && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    )}
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
                                    {likedSongs.length} songs
                                </p>
                            </div>
                            <Button className="ml-auto bg-rave-accent hover:bg-rave-accent-hover">
                                <Play className="h-4 w-4 mr-2" />
                                Play All
                            </Button>
                        </div>

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
                                                    className="text-green-500 hover:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity"
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
        </div>
    );
}
