import mongoose, { Schema, Document } from "mongoose";

export interface ISong extends Document {
    name: string;
    artist: string;
    photo: string;
    media?: string;
    webId?: string;
}

const SongSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        artist: {
            type: String,
            required: true,
            trim: true,
        },
        photo: {
            type: String,
            required: true,
        },
        media: {
            type: String,
            required: false,
        },
        webId: {
            type: String,
            unique: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ISong>("Song", SongSchema);
