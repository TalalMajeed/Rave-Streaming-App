"use client";

import { CreatePlaylistModal } from "@/components/CreatePlaylistModal";
import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUser } from "@/contexts/UserContext";
import { apiService } from "@/lib/api";
import {
    Home,
    Library,
    LogOut,
    Music,
    Plus,
    Search,
    Settings
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

const navigation = [
    {
        title: "Home",
        url: "/app/home",
        icon: Home,
    },
    {
        title: "Search",
        url: "/app",
        icon: Search,
    },
    {
        title: "Your Library",
        url: "/app/library",
        icon: Library,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useUser();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const data = await apiService.getUserPlaylists();
            setPlaylists(data);
        } catch (err) {
            setPlaylists([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const handlePlaylistCreated = () => {
        setShowCreateModal(false);
        fetchPlaylists();
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <Sidebar className="border-r border-rave-dark-border">
            <SidebarHeader className="p-4">
                <Logo size={32} />
            </SidebarHeader>

            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                    >
                                        <Link
                                            href={item.url}
                                            className="flex items-center gap-3 px-3 py-2"
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Your Library
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="mb-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full justify-start text-gray-300 hover:text-white"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <Plus className="h-4 w-5 mr-1" />
                                Create Playlist
                            </Button>
                            <CreatePlaylistModal open={showCreateModal} onOpenChange={setShowCreateModal} onCreate={handlePlaylistCreated} />
                        </div>
                        <SidebarMenu>
                            {loading ? (
                                <SidebarMenuItem>
                                    <span className="text-gray-400 px-3 py-2">Loading...</span>
                                </SidebarMenuItem>
                            ) : playlists.length === 0 ? (
                                <SidebarMenuItem>
                                    <span className="text-gray-400 px-3 py-2">No playlists</span>
                                </SidebarMenuItem>
                            ) : playlists.map((playlist) => (
                                <SidebarMenuItem key={playlist._id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={
                                            pathname ===
                                            `/app/playlist/${playlist._id}`
                                        }
                                    >
                                        <Link
                                            href={`/app/playlist/${playlist._id}`}
                                            className="flex items-center gap-3 px-3 py-2"
                                        >
                                            <Music className="h-4 w-4" />
                                            <span className="text-sm">
                                                {playlist.name}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <Link href="/app/settings">
                    <Button
                        variant="ghost"
                        className={`w-full justify-start ${
                            pathname === "/app/settings"
                                ? "bg-rave-dark-surface text-white"
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
