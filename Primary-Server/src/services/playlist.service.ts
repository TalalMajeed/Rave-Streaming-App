import Playlist, { IPlaylist } from "../models/Playlist";
import { IUser } from "../models/User";

export class PlaylistService {
    async createPlaylist(playlistData: {
        name: string;
        photo: string;
        songs: string[];
        creator: string;
    }): Promise<IPlaylist> {
        const playlist = new Playlist(playlistData);
        return playlist.save();
    }

    async getPlaylistById(id: string): Promise<IPlaylist | null> {
        return Playlist.findById(id)
            .populate("songs")
            .populate("creator", "name email");
    }

    async getUserPlaylists(userId: string): Promise<IPlaylist[]> {
        return Playlist.find({ creator: userId })
            .populate("songs")
            .populate("creator", "name email");
    }

    async updatePlaylist(
        id: string,
        updates: Partial<IPlaylist>
    ): Promise<IPlaylist | null> {
        return Playlist.findByIdAndUpdate(id, updates, { new: true })
            .populate("songs")
            .populate("creator", "name email");
    }

    async deletePlaylist(id: string): Promise<IPlaylist | null> {
        return Playlist.findByIdAndDelete(id);
    }

    async addSongToPlaylist(
        playlistId: string,
        songId: string
    ): Promise<IPlaylist | null> {
        return Playlist.findByIdAndUpdate(
            playlistId,
            { $addToSet: { songs: songId } },
            { new: true }
        ).populate("songs");
    }

    async removeSongFromPlaylist(
        playlistId: string,
        songId: string
    ): Promise<IPlaylist | null> {
        return Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { songs: songId } },
            { new: true }
        ).populate("songs");
    }
}
