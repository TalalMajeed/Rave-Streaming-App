import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
            };
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your-secret-key"
        ) as { _id: string };
        req.user = { _id: decoded._id };

        next();
    } catch (error) {
        res.status(401).json({ error: "Please authenticate." });
    }
};
