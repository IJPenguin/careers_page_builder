"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
    userId: string;
    email: string;
    companyId: string;
}

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    login: (
        email: string,
        password: string,
        companySlug: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    refetch: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const response = await fetch("/api/auth/me");
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (
        email: string,
        password: string,
        companySlug: string
    ) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, companySlug }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Login failed");
        }

        const data = await response.json();
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
            });
            setUser(null);
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const refetch = async () => {
        setLoading(true);
        await fetchUser();
    };

    return {
        user,
        loading,
        login,
        logout,
        refetch,
    };
}
