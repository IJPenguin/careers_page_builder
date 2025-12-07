import { NextRequest, NextResponse } from "next/server";
import { verifyToken, type JWTPayload } from "../auth/jwt";

export interface AuthenticatedRequest extends NextRequest {
    user?: JWTPayload;
}

export function authMiddleware(
    handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
    return async (req: NextRequest): Promise<NextResponse> => {
        try {
            // Get token from Authorization header or cookie
            const authHeader = req.headers.get("authorization");
            const token =
                authHeader?.replace("Bearer ", "") ||
                req.cookies.get("auth_token")?.value;

            if (!token) {
                return NextResponse.json(
                    { error: "Authentication required" },
                    { status: 401 }
                );
            }

            // Verify token
            const user = verifyToken(token);
            if (!user) {
                return NextResponse.json(
                    { error: "Invalid or expired token" },
                    { status: 401 }
                );
            }

            if (user instanceof Error) {
                return NextResponse.json(
                    { error: user.message },
                    { status: 401 }
                );
            }

            // Attach user to request
            const authenticatedReq = req as AuthenticatedRequest;
            authenticatedReq.user = user;

            // Call the handler
            return handler(authenticatedReq);
        } catch (error) {
            return NextResponse.json(
                { error: "Authentication failed" },
                { status: 401 }
            );
        }
    };
}

export function companyAccessMiddleware(
    handler: (
        req: AuthenticatedRequest,
        companySlug: string
    ) => Promise<NextResponse>
) {
    return authMiddleware(async (req: AuthenticatedRequest) => {
        try {
            // Extract company slug from URL
            const url = new URL(req.url);
            const pathParts = url.pathname.split("/");
            const companySlug = pathParts[1]; // Assuming /<company-slug>/...

            if (!companySlug) {
                return NextResponse.json(
                    { error: "Company slug not found" },
                    { status: 400 }
                );
            }

            // Note: Add database check here to verify user belongs to company
            // For now, we'll do this check in the route handler

            return handler(req, companySlug);
        } catch (error) {
            return NextResponse.json(
                { error: "Access denied" },
                { status: 403 }
            );
        }
    });
}
