import User, { IUser } from "../models/User";
import jwt from "jsonwebtoken";

export class UserService {
    async createUser(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<{ user: IUser; token: string }> {
        const user = new User(userData);
        await user.save();

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET || "your-secret-key"
        );
        return { user, token };
    }

    async login(
        email: string,
        password: string
    ): Promise<{ user: IUser; token: string }> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid login credentials");
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error("Invalid login credentials");
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET || "your-secret-key"
        );
        return { user, token };
    }

    async getUserById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    async updateUser(
        id: string,
        updates: Partial<IUser>
    ): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, updates, { new: true });
    }

    async deleteUser(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }
}
