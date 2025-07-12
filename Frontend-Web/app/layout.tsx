import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { UserProvider } from "@/contexts/UserContext";
import { SongQueueProvider } from "@/contexts/SongQueueContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Rave - Your Music Streaming Platform",
    description: "Discover, stream, and enjoy your favorite music with Rave",
    icons: {
        icon: [
            {
                url: "/rave-dark.png",
                media: "(prefers-color-scheme: light)",
            },
            {
                url: "/rave-logo.png",
                media: "(prefers-color-scheme: dark)",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <UserProvider>
                        <SongQueueProvider>
                            {children}
                            <Toaster
                                position="top-right"
                                richColors
                                closeButton
                            />
                        </SongQueueProvider>
                    </UserProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
