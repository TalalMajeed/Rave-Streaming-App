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
import Image from "next/image";
import { useState } from "react";

export function CreatePlaylistModal({ open, onOpenChange, onCreate }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (data: { name: string; description: string; songIds: number[] }) => void;
}) {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<string>("");

  // Placeholder recommended songs with photo
  const recommendedSongs = [
    { id: 101, title: "Recommended Song 1", artist: "Artist A", photo: "/placeholder1.svg" },
    { id: 102, title: "Recommended Song 2", artist: "Artist B", photo: "/placeholder2.svg" },
    { id: 103, title: "Recommended Song 3", artist: "Artist C", photo: "/placeholder3.svg" },
  ];

  const handleSongToggle = (id: number) => {
    setSelectedSongs((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
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
    if (!finalCover && selectedSongs.length > 0) {
      const firstSong = recommendedSongs.find(song => song.id === selectedSongs[0]);
      finalCover = firstSong?.photo || "";
    }
    if (!finalCover) {
      finalCover = "/placeholder.svg";
    }
    try {
      await apiService.createPlaylist({
        name: playlistName,
        description: playlistDescription,
        songIds: selectedSongs.map(String),
        photo: finalCover,
      });
      if (onCreate) {
        onCreate({
          name: playlistName,
          description: playlistDescription,
          songIds: selectedSongs,
        });
      }
      setPlaylistName("");
      setPlaylistDescription("");
      setSelectedSongs([]);
      setCoverImage("");
      onOpenChange(false);
      alert("Playlist created successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-8">
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription>
            Enter a name and description for your playlist. Select recommended songs to add.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-2">
          <div>
            <div className="font-medium mb-2 text-base">Cover Image</div>
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 relative rounded-md overflow-hidden border border-rave-dark-border bg-rave-dark-surface flex items-center justify-center">
                {coverImage ? (
                  <Image src={coverImage} alt="Cover Preview" fill className="object-cover" />
                ) : (
                  <Image src="/placeholder.svg" alt="Default Cover" fill className="object-cover" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rave-accent/10 file:text-rave-accent hover:file:bg-rave-accent/20"
              />
            </div>
          </div>
          <Input
            placeholder="Playlist Name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="text-lg py-3"
          />
          <Input
            placeholder="Description (optional)"
            value={playlistDescription}
            onChange={(e) => setPlaylistDescription(e.target.value)}
            className="py-3"
          />
          <div>
            <div className="font-medium mb-3 text-base">Recommended Songs</div>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {recommendedSongs.map((song) => (
                <label key={song.id} className="flex items-center gap-3 cursor-pointer text-base">
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song.id)}
                    onChange={() => handleSongToggle(song.id)}
                    className="accent-rave-accent scale-125"
                  />
                  <span className="text-white">{song.title} <span className="text-gray-400">- {song.artist}</span></span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreate} disabled={!playlistName.trim() || loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 