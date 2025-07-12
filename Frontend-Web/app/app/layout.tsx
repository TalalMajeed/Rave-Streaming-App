import type React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { MusicPlayer } from "@/components/music-player";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-rave-dark-bg flex flex-col">
                <SidebarProvider>
                    <div className="flex flex-1">
                        <AppSidebar />
                        <SidebarInset className="flex-1 flex flex-col">
                            <main className="flex-1 overflow-auto">
                                {children}
                            </main>
                            <MusicPlayer />
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </div>
        </ProtectedRoute>
    );
}
