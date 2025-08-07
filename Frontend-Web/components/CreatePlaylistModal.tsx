import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiService } from "@/lib/api";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function CreatePlaylistModal({ open, onOpenChange, onCreate }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (data: { name: string; description: string; songIds: number[] }) => void;
}) {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [likedSongs, setLikedSongs] = useState<Record<string, boolean>>({});
  const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({});

  // Fetch songs when search changes
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setSearchError("");
      return;
    }
    setSearchLoading(true);
    setSearchError("");
    apiService.searchSongs(search.trim())
      .then((results) => {
        console.log("Search Results:", results); // Debug: check song IDs
        console.log("First song structure:", results[0]); // Debug: check song structure
        console.log("Number of search results:", results.length);
        setSearchResults(results);
        // Check which songs are already liked
        checkLikedStatus(results);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setSearchError("Failed to fetch songs");
        setSearchResults([]);
      })
      .finally(() => setSearchLoading(false));
  }, [search]);

  const checkLikedStatus = async (songs: any[]) => {
    const newLikedState: Record<string, boolean> = {};
    for (const song of songs) {
      const songId = song.id || song._id;
      if (songId) {
        try {
          const response = await apiService.isSongLiked(String(songId));
          newLikedState[songId] = response.isLiked;
        } catch (error) {
          console.error(`Error checking like status for song ${songId}:`, error);
          newLikedState[songId] = false;
        }
      }
    }
    setLikedSongs(prev => ({ ...prev, ...newLikedState }));
  };

  const handleLikeToggle = async (songId: string) => {
    console.log("Like button clicked for song ID:", songId);
    console.log("Current liked state:", likedSongs[songId]);
    console.log("Auth token:", localStorage.getItem("token"));
    
    setLikeLoading(prev => ({ ...prev, [songId]: true }));
    
    try {
      if (likedSongs[songId]) {
        // Unlike the song
        console.log("Attempting to unlike song:", songId);
        await apiService.removeFromLikedSongs(songId);
        setLikedSongs(prev => ({ ...prev, [songId]: false }));
        console.log("Song unliked successfully");
        // Notify other components that a song was unliked
        window.dispatchEvent(new CustomEvent('songUnliked'));
      } else {
        // Like the song
        console.log("Attempting to like song:", songId);
        await apiService.addToLikedSongs(songId);
        setLikedSongs(prev => ({ ...prev, [songId]: true }));
        console.log("Song liked successfully");
        // Notify other components that a song was liked
        window.dispatchEvent(new CustomEvent('songLiked'));
      }
    } catch (error) {
      console.error(`Error toggling like for song ${songId}:`, error);
      // You might want to show a toast notification here
    } finally {
      setLikeLoading(prev => ({ ...prev, [songId]: false }));
    }
  };

  const handleSongToggle = (id: string) => {
    console.log("Toggling song with ID:", id);
    setSelectedSongs((prev) => {
      const newSelection = prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id];
      console.log("Updated song selection:", newSelection);
      return newSelection;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    // Determine which image to use
    let finalCover = coverImage;
    let allSongs = search.trim() ? searchResults : []; // Removed recommendedSongs
    if (!finalCover && selectedSongs.length > 0) {
      const firstSong = allSongs.find(song => song.id === selectedSongs[0] || song._id === selectedSongs[0]);
      finalCover = firstSong?.photo || firstSong?.image || "";
    }
    if (!finalCover) {
      finalCover = "/placeholder.svg";
    }
    

    
    try {
      // Simply use the selectedSongs array directly, ensuring all items are strings
      const finalSongsArray = selectedSongs.map(songId => String(songId));
      
      const playlistData = {
        name: playlistName,
        description: playlistDescription,
        songs: finalSongsArray,
        photo: finalCover,
      };
      
      const result = await apiService.createPlaylist(playlistData);
      
      console.log("Playlist created successfully:", result);
      
      if (onCreate) {
        onCreate({
          name: playlistName,
          description: playlistDescription,
          songIds: selectedSongs.map(Number),
        });
      }
      
      // Notify other components that a playlist was created
      window.dispatchEvent(new CustomEvent('playlistCreated'));
      
      setPlaylistName("");
      setPlaylistDescription("");
      setSelectedSongs([]);
      setCoverImage("");
      onOpenChange(false);
      alert("Playlist created successfully!");
    } catch (err: any) {
      console.error("Error creating playlist:", err);
      alert(err.message || "Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-0 h-[600px] flex flex-col bg-rave-dark-bg rounded-2xl shadow-2xl">
        <DialogHeader className="px-10 pt-8 pb-2">
          <DialogTitle className="text-2xl">Create New Playlist</DialogTitle>
          <DialogDescription className="text-base text-gray-400 mt-1">
            Give your playlist a name, description, cover image, and add your favorite songs.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-8 flex-1 overflow-y-auto px-10 pb-6">
          {/* Playlist Details Section */}
          <div className="mb-2">
            <div className="text-lg font-semibold text-white mb-4 tracking-wide">Playlist Details</div>
            <div className="flex gap-8 items-center bg-rave-dark-surface rounded-xl p-6 border border-rave-dark-border shadow-md">
              {/* Cover Image and Upload (to be enhanced next) */}
              <div className="flex flex-col items-center min-w-[120px]">
                <div className="font-medium mb-2 text-base">Cover Image</div>
                <div className="w-28 h-28 relative rounded-lg overflow-hidden border border-rave-dark-border bg-rave-dark-surface flex items-center justify-center mb-3 shadow-md group">
                  {coverImage ? (
                    <Image src={coverImage} alt="Cover Preview" fill className="object-cover" />
                  ) : (
                    <Image src="/placeholder.svg" alt="Default Cover" fill className="object-cover" />
                  )}
                  {/* Overlay and remove/reset button will be added in next step */}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-rave-accent/10 file:text-rave-accent hover:file:bg-rave-accent/20 focus:outline-none focus:ring-2 focus:ring-rave-accent"
                />
              </div>
              {/* Name and Description Fields (to be enhanced next) */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-300 mb-1" htmlFor="playlist-name">Playlist Name <span className="text-rave-accent">*</span></label>
                  <Input
                    id="playlist-name"
                    placeholder="Playlist Name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="text-lg py-3 bg-rave-dark-bg border-rave-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rave-accent transition-shadow"
                    maxLength={50}
                    aria-required="true"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">Required</span>
                    <span className="text-xs text-gray-500">{playlistName.length}/50</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1" htmlFor="playlist-desc">Description</label>
                  <textarea
                    id="playlist-desc"
                    placeholder="Description (optional)"
                    value={playlistDescription}
                    onChange={(e) => setPlaylistDescription(e.target.value)}
                    className="w-full py-3 px-3 bg-rave-dark-bg border-rave-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-rave-accent transition-shadow resize-none text-base"
                    maxLength={200}
                    rows={2}
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-500">{playlistDescription.length}/200</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="border-rave-dark-border/60 my-4" />
          {/* Add Songs Section */}
          <div>
            <div className="text-lg font-semibold text-white mb-4 tracking-wide flex items-center justify-between">
              <span>Add Songs</span>
              {selectedSongs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedSongs([])}
                  className="text-xs px-3 py-1 rounded-full bg-rave-accent/10 text-rave-accent hover:bg-rave-accent/20 transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Search for songs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-rave-dark-border bg-rave-dark-surface text-white placeholder-gray-400 mb-3 focus:outline-none focus:ring-2 focus:ring-rave-accent transition-shadow"
              aria-label="Search for songs"
            />
            {searchLoading && <div className="text-gray-400 text-sm">Searching...</div>}
            {searchError && <div className="text-red-500 text-sm">{searchError}</div>}
            {search.trim() ? (
              searchResults.length > 0 ? (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                  {searchResults.map((song) => {
                    const songId = song.id || song._id;
                    const selected = selectedSongs.includes(String(songId));
                    const isLiked = likedSongs[songId] || false;
                    return (
                      <div
                        key={songId}
                        className={`flex items-center gap-3 text-base rounded-lg px-2 py-2 transition-colors hover:bg-rave-dark-bg/60 ${selected ? 'bg-rave-accent/10 border border-rave-accent' : ''}`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleSongToggle(String(songId))}
                            className="accent-rave-accent scale-125"
                          />
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-rave-dark-surface border border-rave-dark-border relative">
                            <img src={song.image || song.photo} alt={song.name} className="object-cover w-full h-full" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-white font-medium truncate">{song.name}</span>
                            <span className="text-gray-400 text-xs truncate">{song.album}</span>
                            <span className="text-gray-500 text-xs truncate">{song.artist}</span>
                          </div>
                        </label>
                        <div className="flex items-center gap-2">
                          {selected && <span className="text-xs px-2 py-0.5 rounded-full bg-rave-accent text-white">Selected</span>}
                          <button
                            type="button"
                            onClick={(e) => {
                              console.log("Button clicked for song:", song.name);
                              e.preventDefault();
                              e.stopPropagation();
                              handleLikeToggle(String(songId));
                            }}
                            disabled={likeLoading[songId]}
                            className="text-rave-accent hover:text-rave-accent/80 transition-colors p-1 rounded-full hover:bg-rave-accent/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            title={isLiked ? "Remove from liked songs" : "Add to liked songs"}
                          >
                            {likeLoading[songId] ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-rave-accent border-t-transparent" />
                            ) : (
                              <Heart className={`h-4 w-4 ${isLiked ? 'fill-rave-accent' : ''}`} />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                !searchLoading && !searchError && <div className="text-gray-400 text-sm">No songs found.</div>
              )
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Search for songs to add to your playlist</p>
                  <p className="text-gray-500 text-sm">Type in the search box above to find your favorite songs</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-6 px-10 pb-8">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreate} disabled={!playlistName.trim() || loading} aria-disabled={!playlistName.trim() || loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 