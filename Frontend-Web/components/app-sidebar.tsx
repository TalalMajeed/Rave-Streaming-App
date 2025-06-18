"use client";

import {
    Home,
    Library,
    Settings,
    Search,
    Heart,
    Plus,
    Music,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./logo";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

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

const playlists = [
    { id: "1", name: "Liked Songs", icon: Heart, iconColor: "text-green-500" },
    { id: "2", name: "Chill Vibes", icon: Music },
    { id: "3", name: "Workout Mix", icon: Music },
    { id: "4", name: "Road Trip Hits", icon: Music },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useUser();

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
                            >
                                <Plus className="h-4 w-5 mr-1" />
                                Create Playlist
                            </Button>
                        </div>
                        <SidebarMenu>
                            {playlists.map((playlist) => (
                                <SidebarMenuItem key={playlist.id}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={
                                            pathname ===
                                            `/app/playlist/${playlist.id}`
                                        }
                                    >
                                        <Link
                                            href={`/app/playlist/${playlist.id}`}
                                            className="flex items-center gap-3 px-3 py-2"
                                        >
                                            <playlist.icon
                                                className={`h-4 w-4 ${
                                                    playlist.iconColor || ""
                                                }`}
                                            />
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
