"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

export function useAuthRedirect() {
    const { user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            router.push("/app");
        }
    }, [user, isLoading, router]);

    return { isLoading, user };
}
