"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSongQueue } from "@/contexts/SongQueueContext";
import { apiService, Song } from "@/lib/api";
import { Heart, MoreHorizontal, Play, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// For demo, import playlists from library page (in real app, fetch from API)
const userPlaylists = [
  { id: "1", title: "My Playlist #1" },
  { id: "2", title: "Chill Vibes" },
  { id: "3", title: "Workout Mix" },
  { id: "4", title: "Road Trip Hits" },
];

export default function AppPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const { playSongById, currentSong, state } = useSongQueue();
    const router = useRouter();

    // Debounce search query
    useEffect(() => {
        setIsTyping(true);
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setIsTyping(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch songs when debounced query changes
    const fetchSongs = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSongs([]);
            return;
        }

        setLoading(true);
        try {
            const results = await apiService.searchSongs(query);
            setSongs(results);
        } catch (error) {
            console.error("Error fetching songs:", error);
            setSongs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSongs(debouncedQuery);
    }, [debouncedQuery, fetchSongs]);

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
                        {searchQuery
                            ? `Search Results for "${searchQuery}"`
                            : "Search for songs"}
                    </h2>

                    {(loading || isTyping) && searchQuery && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">Searching...</p>
                        </div>
                    )}

                    {!loading && !isTyping && songs.length > 0 && (
                        <div className="space-y-2">
                            {songs.map((song, index) => (
                                <Card
                                    key={song.id}
                                    className="bg-rave-dark-card border-rave-dark-border hover:bg-rave-dark-surface transition-colors"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-gray-400 w-6 text-center">
                                                {index + 1}
                                            </div>
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-rave-dark-surface">
                                                <Image
                                                    src={song.image}
                                                    alt={`${song.album} cover`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-medium truncate">
                                                    {song.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm truncate">
                                                    {song.artist}
                                                </p>
                                            </div>
                                            <div className="hidden md:block text-gray-400 text-sm min-w-0 flex-1">
                                                {song.album}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-gray-400 hover:text-white"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-gray-400 hover:text-white"
                                                    onClick={() =>
                                                        playSongById(
                                                            song.id,
                                                            song
                                                        )
                                                    }
                                                >
                                                    <Play className="h-4 w-4" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-gray-400 hover:text-white"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>
                                                                Add to Playlist
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuSubContent>
                                                                {userPlaylists.map((playlist) => (
                                                                    <DropdownMenuItem
                                                                        key={playlist.id}
                                                                        onClick={async () => {
                                                                            try {
                                                                                await apiService.addSongToPlaylist(song.id, playlist.id);
                                                                                alert(`Added to ${playlist.title}`);
                                                                            } catch (e) {
                                                                                alert(`Failed to add to ${playlist.title}`);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {playlist.title}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuSub>
                                                        <DropdownMenuItem
                                                            onClick={async () => {
                                                                try {
                                                                    await apiService.addToLikedSongs(song.id);
                                                                    alert("Added to Liked Songs");
                                                                } catch (e) {
                                                                    alert("Failed to add to Liked Songs");
                                                                }
                                                            }}
                                                        >
                                                            Add to Liked Songs
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                // Go to Album page
                                                                router.push(`/app/album/${encodeURIComponent(song.album)}`);
                                                            }}
                                                        >
                                                            Go to the Album
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                // Go to Artist page
                                                                router.push(`/app/artist/${encodeURIComponent(song.artist)}`);
                                                            }}
                                                        >
                                                            Go to the Artist
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={async () => {
                                                                // Share song link
                                                                const shareUrl = `${window.location.origin}/app/song/${song.id}`;
                                                                try {
                                                                    await navigator.clipboard.writeText(shareUrl);
                                                                    alert("Song link copied to clipboard!");
                                                                } catch (e) {
                                                                    alert("Failed to copy link");
                                                                }
                                                            }}
                                                        >
                                                            Share
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!loading &&
                        !isTyping &&
                        searchQuery &&
                        songs.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-400">
                                    No songs found for "{searchQuery}"
                                </p>
                            </div>
                        )}

                    {!searchQuery && !loading && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">
                                Start typing to search for songs
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
