"use client";

import { useSongQueue } from "@/contexts/SongQueueContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Heart,
    Repeat,
    Shuffle,
} from "lucide-react";
import Image from "next/image";

export function MusicPlayer() {
    const {
        currentSong,
        state,
        setIsPlaying,
        setVolume,
        setCurrentTime,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
    } = useSongQueue();

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleVolumeChange = (value: number[]) => {
        setVolume(value[0] / 100);
    };

    const handleProgressChange = (value: number[]) => {
        const newTime = (value[0] / 100) * state.controls.duration;
        console.log(
            "Progress change:",
            value[0],
            "New time:",
            newTime,
            "Duration:",
            state.controls.duration
        );
        setCurrentTime(newTime);
    };

    const progressPercentage =
        state.controls.duration > 0
            ? (state.controls.currentTime / state.controls.duration) * 100
            : 0;

    const volumePercentage = state.controls.volume * 100;

    // Don't render if no song is playing
    if (!currentSong || !state.currentAudioUrl) {
        return null;
    }

    return (
        <div className="bg-rave-dark-surface border-t border-rave-dark-border p-4">
            <div className="flex items-center justify-between max-w-screen-xl mx-auto">
                {/* Current Song Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="relative w-14 h-14 rounded-md overflow-hidden bg-rave-dark-card">
                        <Image
                            src={currentSong.image || "/placeholder.svg"}
                            alt={`${currentSong.name} by ${currentSong.artist}`}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-white font-medium truncate">
                            {currentSong.name}
                        </h4>
                        <p className="text-gray-400 text-sm truncate">
                            {currentSong.artist}
                        </p>
                    </div>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>

                {/* Player Controls */}
                <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
                    <div className="flex items-center gap-4">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                        >
                            <Shuffle className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={playPrevious}
                            disabled={!hasPrevious}
                        >
                            <SkipBack className="h-5 w-5" />
                        </Button>
                        <Button
                            size="sm"
                            className="bg-white text-black hover:bg-gray-200 rounded-full w-8 h-8"
                            onClick={() =>
                                setIsPlaying(!state.controls.isPlaying)
                            }
                        >
                            {state.controls.isPlaying ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="h-4 w-4" />
                            )}
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={playNext}
                            disabled={!hasNext}
                        >
                            <SkipForward className="h-5 w-5" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                        >
                            <Repeat className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                        <span className="text-xs text-gray-400">
                            {formatTime(state.controls.currentTime)}
                        </span>
                        <Slider
                            value={[progressPercentage]}
                            onValueChange={handleProgressChange}
                            max={100}
                            step={1}
                            className="flex-1"
                        />
                        <span className="text-xs text-gray-400">
                            {formatTime(state.controls.duration)}
                        </span>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                    <Volume2 className="h-4 w-4 text-gray-400" />
                    <Slider
                        value={[volumePercentage]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="w-24"
                    />
                </div>
            </div>
        </div>
    );
}
