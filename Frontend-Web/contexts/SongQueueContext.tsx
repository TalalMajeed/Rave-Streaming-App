"use client";

import React, {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    useRef,
    useEffect,
} from "react";
import { Song } from "@/lib/api";
import { apiService } from "@/lib/api";

// Types
export interface AudioControls {
    volume: number;
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    isMuted: boolean;
}

interface SongQueueState {
    queue: Song[];
    currentIndex: number;
    controls: AudioControls;
    currentAudioUrl: string | null;
}

// Actions
type SongQueueAction =
    | { type: "ADD_TO_QUEUE"; payload: Song }
    | { type: "REMOVE_FROM_QUEUE"; payload: string } // song id
    | { type: "CLEAR_QUEUE" }
    | { type: "PLAY_NEXT" }
    | { type: "PLAY_PREVIOUS" }
    | { type: "SET_CURRENT_INDEX"; payload: number }
    | { type: "SET_VOLUME"; payload: number }
    | { type: "SET_CURRENT_TIME"; payload: number }
    | { type: "SET_DURATION"; payload: number }
    | { type: "SET_IS_PLAYING"; payload: boolean }
    | { type: "SET_IS_MUTED"; payload: boolean }
    | { type: "SET_CURRENT_AUDIO_URL"; payload: string | null }
    | {
          type: "REORDER_QUEUE";
          payload: { fromIndex: number; toIndex: number };
      };

// Initial state
const initialState: SongQueueState = {
    queue: [],
    currentIndex: -1,
    controls: {
        volume: 1,
        currentTime: 0,
        duration: 0,
        isPlaying: false,
        isMuted: false,
    },
    currentAudioUrl: null,
};

// Reducer
function songQueueReducer(
    state: SongQueueState,
    action: SongQueueAction
): SongQueueState {
    switch (action.type) {
        case "ADD_TO_QUEUE":
            return {
                ...state,
                queue: [...state.queue, action.payload],
                currentIndex:
                    state.currentIndex === -1 ? 0 : state.currentIndex,
            };

        case "REMOVE_FROM_QUEUE":
            const filteredQueue = state.queue.filter(
                (song) => song.id !== action.payload
            );
            const newIndex =
                state.currentIndex >= filteredQueue.length
                    ? -1
                    : state.currentIndex;
            return {
                ...state,
                queue: filteredQueue,
                currentIndex: newIndex,
            };

        case "CLEAR_QUEUE":
            return {
                ...state,
                queue: [],
                currentIndex: -1,
                controls: {
                    ...state.controls,
                    isPlaying: false,
                    currentTime: 0,
                },
                currentAudioUrl: null,
            };

        case "PLAY_NEXT":
            if (state.queue.length === 0) return state;
            const nextIndex = (state.currentIndex + 1) % state.queue.length;
            return {
                ...state,
                currentIndex: nextIndex,
                controls: {
                    ...state.controls,
                    currentTime: 0,
                },
            };

        case "PLAY_PREVIOUS":
            if (state.queue.length === 0) return state;
            const prevIndex =
                state.currentIndex <= 0
                    ? state.queue.length - 1
                    : state.currentIndex - 1;
            return {
                ...state,
                currentIndex: prevIndex,
                controls: {
                    ...state.controls,
                    currentTime: 0,
                },
            };

        case "SET_CURRENT_INDEX":
            if (action.payload < -1 || action.payload >= state.queue.length)
                return state;
            return {
                ...state,
                currentIndex: action.payload,
                controls: {
                    ...state.controls,
                    currentTime: 0,
                },
            };

        case "SET_VOLUME":
            return {
                ...state,
                controls: {
                    ...state.controls,
                    volume: Math.max(0, Math.min(1, action.payload)),
                },
            };

        case "SET_CURRENT_TIME":
            return {
                ...state,
                controls: {
                    ...state.controls,
                    currentTime: Math.max(
                        0,
                        Math.min(state.controls.duration, action.payload)
                    ),
                },
            };

        case "SET_DURATION":
            return {
                ...state,
                controls: {
                    ...state.controls,
                    duration: action.payload,
                },
            };

        case "SET_IS_PLAYING":
            return {
                ...state,
                controls: {
                    ...state.controls,
                    isPlaying: action.payload,
                },
            };

        case "SET_IS_MUTED":
            return {
                ...state,
                controls: {
                    ...state.controls,
                    isMuted: action.payload,
                },
            };

        case "SET_CURRENT_AUDIO_URL":
            return {
                ...state,
                currentAudioUrl: action.payload,
            };

        case "REORDER_QUEUE":
            const { fromIndex, toIndex } = action.payload;
            if (
                fromIndex < 0 ||
                fromIndex >= state.queue.length ||
                toIndex < 0 ||
                toIndex >= state.queue.length
            ) {
                return state;
            }
            const newQueue = [...state.queue];
            const [movedSong] = newQueue.splice(fromIndex, 1);
            newQueue.splice(toIndex, 0, movedSong);

            // Adjust current index if needed
            let newCurrentIndex = state.currentIndex;
            if (state.currentIndex === fromIndex) {
                newCurrentIndex = toIndex;
            } else if (
                state.currentIndex > fromIndex &&
                state.currentIndex <= toIndex
            ) {
                newCurrentIndex--;
            } else if (
                state.currentIndex < fromIndex &&
                state.currentIndex >= toIndex
            ) {
                newCurrentIndex++;
            }

            return {
                ...state,
                queue: newQueue,
                currentIndex: newCurrentIndex,
            };

        default:
            return state;
    }
}

// Context
interface SongQueueContextType {
    state: SongQueueState;
    // Queue management
    addToQueue: (song: Song) => void;
    removeFromQueue: (songId: string) => void;
    clearQueue: () => void;
    reorderQueue: (fromIndex: number, toIndex: number) => void;

    // Playback controls
    playNext: () => void;
    playPrevious: () => void;
    setCurrentIndex: (index: number) => void;
    playSongById: (songId: string, song?: Song) => Promise<void>;

    // Audio controls
    setVolume: (volume: number) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setIsMuted: (isMuted: boolean) => void;
    setCurrentAudioUrl: (url: string | null) => void;

    // Computed values
    currentSong: Song | null;
    hasNext: boolean;
    hasPrevious: boolean;
    queueLength: number;
}

const SongQueueContext = createContext<SongQueueContextType | undefined>(
    undefined
);

// Provider
interface SongQueueProviderProps {
    children: ReactNode;
}

export function SongQueueProvider({ children }: SongQueueProviderProps) {
    const [state, dispatch] = useReducer(songQueueReducer, initialState);
    const audioRef = useRef<HTMLAudioElement>(null);
    const isUpdatingFromAudio = useRef(false);

    // Audio event handlers
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            isUpdatingFromAudio.current = true;
            setCurrentTime(audio.currentTime);
            console.log(
                "Time update:",
                audio.currentTime,
                "Duration:",
                audio.duration
            );
            isUpdatingFromAudio.current = false;
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            console.log("Loaded metadata - Duration:", audio.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            playNext();
        };

        const handleVolumeChange = () => {
            setVolume(audio.volume);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("volumechange", handleVolumeChange);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("volumechange", handleVolumeChange);
        };
    }, []);

    // Update audio element when controls change
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (state.controls.isPlaying) {
            audio.play().catch(console.error);
        } else {
            audio.pause();
        }
    }, [state.controls.isPlaying]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = state.controls.volume;
    }, [state.controls.volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.muted = state.controls.isMuted;
    }, [state.controls.isMuted]);

    // Update audio currentTime when state changes (from slider)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || isUpdatingFromAudio.current) return;

        // Only update if the difference is significant (more than 0.5 seconds)
        if (Math.abs(audio.currentTime - state.controls.currentTime) > 0.5) {
            audio.currentTime = state.controls.currentTime;
        }
    }, [state.controls.currentTime]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !state.currentAudioUrl) return;

        console.log("Setting audio src:", state.currentAudioUrl);
        audio.src = state.currentAudioUrl;
        audio.load();
    }, [state.currentAudioUrl]);

    // Play song by ID
    const playSongById = async (songId: string, song?: Song) => {
        try {
            const response = await apiService.getSongUrl(songId);
            setCurrentAudioUrl(response.url);

            // Find the song in the queue or add it
            const songIndex = state.queue.findIndex((s) => s.id === songId);
            if (songIndex === -1) {
                // Song not in queue, add it if we have the song data
                if (song) {
                    addToQueue(song);
                    // The song will be set as current by addToQueue
                } else {
                    // Just play without adding to queue
                    setIsPlaying(true);
                }
            } else {
                // Song is in queue, set it as current
                setCurrentIndex(songIndex);
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Error playing song:", error);
        }
    };

    // Queue management functions
    const addToQueue = (song: Song) => {
        dispatch({ type: "ADD_TO_QUEUE", payload: song });
    };

    const removeFromQueue = (songId: string) => {
        dispatch({ type: "REMOVE_FROM_QUEUE", payload: songId });
    };

    const clearQueue = () => {
        dispatch({ type: "CLEAR_QUEUE" });
    };

    const reorderQueue = (fromIndex: number, toIndex: number) => {
        dispatch({ type: "REORDER_QUEUE", payload: { fromIndex, toIndex } });
    };

    // Playback control functions
    const playNext = () => {
        dispatch({ type: "PLAY_NEXT" });
    };

    const playPrevious = () => {
        dispatch({ type: "PLAY_PREVIOUS" });
    };

    const setCurrentIndex = (index: number) => {
        dispatch({ type: "SET_CURRENT_INDEX", payload: index });
    };

    // Audio control functions
    const setVolume = (volume: number) => {
        dispatch({ type: "SET_VOLUME", payload: volume });
    };

    const setCurrentTime = (time: number) => {
        dispatch({ type: "SET_CURRENT_TIME", payload: time });
    };

    const setDuration = (duration: number) => {
        dispatch({ type: "SET_DURATION", payload: duration });
    };

    const setIsPlaying = (isPlaying: boolean) => {
        dispatch({ type: "SET_IS_PLAYING", payload: isPlaying });
    };

    const setIsMuted = (isMuted: boolean) => {
        dispatch({ type: "SET_IS_MUTED", payload: isMuted });
    };

    const setCurrentAudioUrl = (url: string | null) => {
        dispatch({ type: "SET_CURRENT_AUDIO_URL", payload: url });
    };

    // Computed values
    const currentSong =
        state.currentIndex >= 0 && state.currentIndex < state.queue.length
            ? state.queue[state.currentIndex]
            : null;

    const hasNext = state.queue.length > 1;
    const hasPrevious = state.queue.length > 1;
    const queueLength = state.queue.length;

    const value: SongQueueContextType = {
        state,
        addToQueue,
        removeFromQueue,
        clearQueue,
        reorderQueue,
        playNext,
        playPrevious,
        setCurrentIndex,
        playSongById,
        setVolume,
        setCurrentTime,
        setDuration,
        setIsPlaying,
        setIsMuted,
        setCurrentAudioUrl,
        currentSong,
        hasNext,
        hasPrevious,
        queueLength,
    };

    return (
        <SongQueueContext.Provider value={value}>
            {children}
            <audio
                ref={audioRef}
                controls
                style={{
                    display: "none",
                }}
            />
        </SongQueueContext.Provider>
    );
}

// Hook
export function useSongQueue() {
    const context = useContext(SongQueueContext);
    if (context === undefined) {
        throw new Error("useSongQueue must be used within a SongQueueProvider");
    }
    return context;
}
