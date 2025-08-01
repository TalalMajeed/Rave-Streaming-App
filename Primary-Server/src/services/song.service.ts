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

            const songs = data.songs.data.map((song: any) => ({
                id: song.id,
                name: song.title.replace(/&quot;/g, '"').replace(/&amp;/g, "&"),
                album: song.album
                    .replace(/&quot;/g, '"')
                    .replace(/&amp;/g, "&"),
                artist: song.more_info.primary_artists
                    .replace(/&quot;/g, '"')
                    .replace(/&amp;/g, "&"),
                image: song.image.replace("50x50", "250x250"),
                duration: song.more_info.duration,
            }));

            // Save each song to database if it doesn't exist
            for (const song of songs) {
                await this.saveWebSongToDatabase(song);
            }

            return songs;
        } catch (error) {
            console.error("Error searching JioSaavn:", error);
            return [];
        }
    }

    private async saveWebSongToDatabase(songData: {
        id: string;
        name: string;
        album: string;
        artist: string;
        image: string;
        duration: string;
    }): Promise<void> {
        try {
            // Check if song already exists by webId
            const existingSong = await Song.findOne({ webId: songData.id });

            if (!existingSong) {
                // Create new song in database
                const newSong = new Song({
                    name: songData.name,
                    artist: songData.artist,
                    photo: songData.image,
                    webId: songData.id,
                });

                await newSong.save();
                console.log(`Saved new song to database: ${songData.name}`);
            }
        } catch (error) {
            console.error(
                `Error saving song ${songData.name} to database:`,
                error
            );
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
            const decryptedUrl = this.decryptUrl(encryptedUrl);

            // Save the media URL to the corresponding song document if it exists
            await this.updateSongMediaUrl(songId, decryptedUrl);

            return decryptedUrl;
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

    private async updateSongMediaUrl(
        webId: string,
        mediaUrl: string
    ): Promise<void> {
        try {
            // Find the song by webId and update its media field
            const updatedSong = await Song.findOneAndUpdate(
                { webId: webId },
                { media: mediaUrl },
                { new: true }
            );

            if (updatedSong) {
                console.log(`Updated media URL for song: ${updatedSong.name}`);
            } else {
                console.log(`Song with webId ${webId} not found in database`);
            }
        } catch (error) {
            console.error(
                `Error updating media URL for song with webId ${webId}:`,
                error
            );
        }
    }
}
