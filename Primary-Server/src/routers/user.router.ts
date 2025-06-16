import { Router } from "express";
import { UserService } from "../services/user.service";
import { auth } from "../middleware/auth.middleware";

const router = Router();
const userService = new UserService();

// Register new user
router.post("/register", async (req, res) => {
    try {
        const { user, token } = await userService.createUser(req.body);
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.login(email, password);
        res.json({ user, token });
    } catch (error) {
        res.status(401).json({ error: (error as Error).message });
    }
});

// Get user profile
router.get("/profile", auth, async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const user = await userService.getUserById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

// Update user profile
router.patch("/profile", auth, async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const user = await userService.updateUser(req.user._id, req.body);
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

// Delete user account
router.delete("/profile", auth, async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const user = await userService.deleteUser(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;
