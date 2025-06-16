import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MusicPlayer } from "@/components/music-player"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-rave-dark-bg">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="pb-24">
          <main className="flex-1">{children}</main>
        </SidebarInset>
        <MusicPlayer />
      </SidebarProvider>
    </div>
  )
}
