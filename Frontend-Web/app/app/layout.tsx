import type React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MusicPlayer } from "@/components/music-player";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-rave-dark-bg">
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset className="pb-24">
                        <main className="flex-1">{children}</main>
                    </SidebarInset>
                    <MusicPlayer />
                </SidebarProvider>
            </div>
        </ProtectedRoute>
    );
}
