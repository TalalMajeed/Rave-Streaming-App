import Playlist, { IPlaylist } from "../models/Playlist";

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
            .populate("creator", "name email");
    }

    async getUserPlaylists(userId: string): Promise<IPlaylist[]> {
        return Playlist.find({ creator: userId })
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

    async deletePlaylist(id: string, userId: string): Promise<IPlaylist | null> {
        // First check if the playlist exists and belongs to the user
        const playlist = await Playlist.findOne({ _id: id, creator: userId });
        if (!playlist) {
            return null;
        }
        
        // Delete the playlist
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
