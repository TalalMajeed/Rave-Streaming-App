import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { SongService } from "../services/song.service";
import { UserService } from "../services/user.service";

const router = Router();
const songService = new SongService();
const userService = new UserService();

// Get all songs
router.get("/", async (req, res) => {
    try {
        const songs = await songService.getAllSongs();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Search JioSaavn songs
router.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || typeof query !== "string") {
            return res.status(400).json({ error: "Search query is required" });
        }
        const songs = await songService.searchWebSongs(query);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get("/play/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const songUrl = await songService.playWebSongs(id);
        res.json({ url: songUrl });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Like a song (protected route)
router.post("/like", auth, async (req, res) => {
    try {
        const { songId } = req.body;
        const userId = (req as any).user._id;

        if (!songId) {
            return res.status(400).json({ error: "Song ID is required" });
        }

        const user = await userService.addToLikedSongs(userId, songId);
        res.json({ message: "Song added to liked songs", user });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Unlike a song (protected route)
router.delete("/like/:songId", auth, async (req, res) => {
    try {
        const { songId } = req.params;
        const userId = (req as any).user._id;

        const user = await userService.removeFromLikedSongs(userId, songId);
        res.json({ message: "Song removed from liked songs", user });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Get liked songs (protected route)
router.get("/liked", auth, async (req, res) => {
    try {
        const userId = (req as any).user._id;
        const likedSongs = await userService.getLikedSongs(userId);
        res.json(likedSongs);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Check if song is liked (protected route)
router.get("/liked/:songId", auth, async (req, res) => {
    try {
        const { songId } = req.params;
        const userId = (req as any).user._id;
        const isLiked = await userService.isSongLiked(userId, songId);
        res.json({ isLiked });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Get song by ID
router.get("/:id", async (req, res) => {
    try {
        const song = await songService.getSongById(req.params.id);
        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Get song by webId (external song ID)
router.get("/web/:webId", async (req, res) => {
    try {
        const song = await songService.getSongByWebId(req.params.webId);
        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Delete song (protected route)
router.delete("/:id", auth, async (req, res) => {
    try {
        const song = await songService.deleteSong(req.params.id);
        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
