import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IPlaylist extends Document {
    name: string;
    photo: string;
    songs: string[];
    creator: IUser;
}

const PlaylistSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        photo: {
            type: String,
            required: true,
        },
        songs: [
            {
                type: String,
                required: true,
            },
        ],
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
