"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Play, MoreHorizontal, Heart } from "lucide-react";
import Image from "next/image";
import { apiService, Song } from "@/lib/api";
import { useSongQueue } from "@/contexts/SongQueueContext";

export default function AppPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const { playSongById, currentSong, state } = useSongQueue();

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
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-gray-400 hover:text-white"
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
