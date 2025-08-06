import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { PlaylistService } from "../services/playlist.service";

const router = Router();
const playlistService = new PlaylistService();

// Get all playlists for the authenticated user
router.get("/my-playlists", auth, async (req, res) => {
    try {
        const playlists = await playlistService.getUserPlaylists(req.user!._id);
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Get playlist by ID
router.get("/:id", async (req, res) => {
    try {
        const playlist = await playlistService.getPlaylistById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Create new playlist
router.post("/", auth, async (req, res) => {
    try {
        const playlistData = {
            ...req.body,
            creator: req.user!._id,
        };
        const playlist = await playlistService.createPlaylist(playlistData);
        res.status(201).json(playlist);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Update playlist
router.patch("/:id", auth, async (req, res) => {
    try {
        const playlist = await playlistService.updatePlaylist(
            req.params.id,
            req.body
        );
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }
        res.json(playlist);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Delete playlist
router.delete("/:id", auth, async (req, res) => {
    try {
        const playlist = await playlistService.deletePlaylist(req.params.id, req.user!._id);
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found or you don't have permission to delete it" });
        }
        res.json({ message: "Playlist deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Add song to playlist
router.post("/:id/songs", auth, async (req, res) => {
    try {
        const { songId } = req.body;
        if (!songId) {
            return res.status(400).json({ error: "Song ID is required" });
        }
        const playlist = await playlistService.addSongToPlaylist(
            req.params.id,
            songId
        );
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }
        res.json(playlist);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Remove song from playlist
router.delete("/:id/songs/:songId", auth, async (req, res) => {
    try {
        const playlist = await playlistService.removeSongFromPlaylist(
            req.params.id,
            req.params.songId
        );
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }
        res.json(playlist);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
