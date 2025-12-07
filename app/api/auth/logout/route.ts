import { NextRequest, NextResponse } from "next/server";
import { removeAuthToken } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
    try {
        await removeAuthToken();

        const response = NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );

        // Clear the auth cookie
        response.cookies.delete("auth_token");

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
