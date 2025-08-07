import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    likedSongs: string[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        likedSongs: [
            {
                type: String,
                default: [],
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const password = this.get("password") as string;
        this.set("password", await bcrypt.hash(password, salt));
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    const password = this.get("password") as string;
    return bcrypt.compare(candidatePassword, password);
};

export default mongoose.model<IUser>("User", UserSchema);
