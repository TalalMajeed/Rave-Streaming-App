import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./connections/mongodb";
import path from "path";
import userRouter from "./routers/user.router";
import songRouter from "./routers/song.router";
import playlistRouter from "./routers/playlist.router";

const envFile =
    process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development";
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/users", userRouter);
app.use("/api/songs", songRouter);
app.use("/api/playlists", playlistRouter);

// Root route - serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error(err.stack);
        res.status(500).json({ error: "Something went wrong!" });
    }
);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
