import { cookies } from "next/headers";
import { verifyToken, type JWTPayload } from "./jwt";

const TOKEN_COOKIE_NAME = "auth_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setAuthToken(token: string): Promise<void> {
    (await cookies()).set(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: TOKEN_MAX_AGE,
        path: "/",
    });
}

export async function getAuthToken(): Promise<string | null> {
    const token = (await cookies()).get(TOKEN_COOKIE_NAME);
    return token?.value || null;
}

export async function removeAuthToken(): Promise<void> {
    (await cookies()).delete(TOKEN_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
    const token = await getAuthToken();
    if (!token) return null;

    const res = verifyToken(token);
    if (res instanceof Error) {
        return null;
    }
    return res;   
}

export async function requireAuth(): Promise<JWTPayload> {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}

export async function requireCompanyAccess(
    companySlug: string
): Promise<JWTPayload> {
    const user = await requireAuth();

    // This will be enhanced to check if user belongs to the company
    // For now, we'll add the validation in the API route

    return user;
}
