import mongoose, { Schema, Document } from "mongoose";
import { ISong } from "./Song";
import { IUser } from "./User";

export interface IPlaylist extends Document {
    name: string;
    photo: string;
    songs: ISong[];
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
                type: Schema.Types.ObjectId,
                ref: "Song",
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
