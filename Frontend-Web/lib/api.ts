const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: {
        _id: string;
        name: string;
        email: string;
    };
    token: string;
}

export interface Song {
    id: string;
    name: string;
    album: string;
    artist: string;
    image: string;
}

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    private getAuthToken(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token");
        }
        return null;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const token = this.getAuthToken();

        const config: RequestInit = {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Handle token expiration
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    // You might want to redirect to login here
                }

                throw new Error(
                    errorData.error || `HTTP error! status: ${response.status}`
                );
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unexpected error occurred");
        }
    }

    async register(data: RegisterData): Promise<AuthResponse> {
        return this.request<AuthResponse>("/api/users/register", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async login(data: LoginData): Promise<AuthResponse> {
        return this.request<AuthResponse>("/api/users/login", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async getProfile(): Promise<any> {
        return this.request("/api/users/profile");
    }

    async updateProfile(updates: any): Promise<any> {
        return this.request("/api/users/profile", {
            method: "PATCH",
            body: JSON.stringify(updates),
        });
    }

    async deleteProfile(): Promise<any> {
        return this.request("/api/users/profile", {
            method: "DELETE",
        });
    }

    async searchSongs(query: string): Promise<Song[]> {
        return this.request<Song[]>(
            `/api/songs/search?query=${encodeURIComponent(query)}`
        );
    }

    async getSongUrl(songId: string): Promise<{ url: string }> {
        return this.request<{ url: string }>(`/api/songs/play/${songId}`);
    }

    async addToLikedSongs(songId: string): Promise<any> {
        return this.request<any>(`/api/songs/like`, {
            method: "POST",
            body: JSON.stringify({ songId }),
        });
    }

    async addSongToPlaylist(songId: string, playlistId: string): Promise<any> {
        return this.request<any>(`/api/playlists/${playlistId}/add-song`, {
            method: "POST",
            body: JSON.stringify({ songId }),
        });
    }

    async createPlaylist(data: { name: string; description?: string; songIds?: string[]; photo?: string }): Promise<any> {
        return this.request<any>("/api/playlists", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    async getUserPlaylists(): Promise<any[]> {
        return this.request<any[]>("/api/playlists/my-playlists");
    }
}

export const apiService = new ApiService();
