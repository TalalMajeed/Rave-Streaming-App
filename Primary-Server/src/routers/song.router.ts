import { Router } from "express";
import { SongService } from "../services/song.service";
import { auth } from "../middleware/auth.middleware";

const router = Router();
const songService = new SongService();

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
