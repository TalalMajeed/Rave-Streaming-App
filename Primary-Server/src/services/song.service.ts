import Song, { ISong } from "../models/Song";
import fetch from "node-fetch";
import pkg from "node-forge";
const { cipher, util } = pkg;

const key = "38346591";
const iv = "00000000";

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

    async searchWebSongs(query: string): Promise<any[]> {
        const url = `https://www.jiosaavn.com/api.php?__call=autocomplete.get&_format=json&_marker=0&cc=in&includeMetaTags=1&query=${query}`;

        try {
            const response = await fetch(encodeURI(url));
            const data: any = await response.json();

            if (!data.songs?.data) {
                return [];
            }

            return data.songs.data.map((song: any) => ({
                id: song.id,
                name: song.title.replace(/&quot;/g, '"').replace(/&amp;/g, "&"),
                album: song.album
                    .replace(/&quot;/g, '"')
                    .replace(/&amp;/g, "&"),
                artist: song.more_info.primary_artists
                    .replace(/&quot;/g, '"')
                    .replace(/&amp;/g, "&"),
                image: song.image,
                duration: song.more_info.duration,
            }));
        } catch (error) {
            console.error("Error searching JioSaavn:", error);
            return [];
        }
    }

    async playWebSongs(songId: string): Promise<string> {
        const url = `https://www.jiosaavn.com/api.php?__call=song.getDetails&cc=in&_marker=0%3F_marker%3D0&_format=json&pids=${songId}`;

        try {
            const response = await fetch(encodeURI(url));
            const data: any = await response.json();

            if (!data[songId]?.encrypted_media_url) {
                throw new Error("Song not found");
            }

            const encryptedUrl = data[songId].encrypted_media_url;
            return this.decryptUrl(encryptedUrl);
        } catch (error) {
            console.error("Error getting JioSaavn song URL:", error);
            throw error;
        }
    }

    private decryptUrl(encryptedUrl: string): string {
        const encrypted = util.decode64(encryptedUrl);
        const decipher = cipher.createDecipher(
            "DES-ECB",
            util.createBuffer(key, "utf8")
        );

        decipher.start({ iv: util.createBuffer(iv, "utf8") });
        decipher.update(util.createBuffer(encrypted));
        decipher.finish();

        return decipher.output.getBytes();
    }
}
