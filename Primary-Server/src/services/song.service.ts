import Song, { ISong } from "../models/Song";

export class SongService {
    async createSong(songData: {
        name: string;
        artist: string;
        photo: string;
        media: string;
    }): Promise<ISong> {
        const song = new Song(songData);
        return song.save();
    }

    async getAllSongs(): Promise<ISong[]> {
        return Song.find();
    }

    async getSongById(id: string): Promise<ISong | null> {
        return Song.findById(id);
    }

    async updateSong(
        id: string,
        updates: Partial<ISong>
    ): Promise<ISong | null> {
        return Song.findByIdAndUpdate(id, updates, { new: true });
    }

    async deleteSong(id: string): Promise<ISong | null> {
        return Song.findByIdAndDelete(id);
    }

    async searchSongs(query: string): Promise<ISong[]> {
        return Song.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { artist: { $regex: query, $options: "i" } },
            ],
        });
    }
}
