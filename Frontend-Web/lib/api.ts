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
}

export const apiService = new ApiService();
