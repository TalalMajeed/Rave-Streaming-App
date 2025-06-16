import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./connections/mongodb";
import path from "path";

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

// Root route - serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
