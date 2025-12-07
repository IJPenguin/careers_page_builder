import jwt from "jsonwebtoken";

const JWT_SECRET =
    process.env.JWT_SECRET || "default-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
    userId: string;
    companyId: string;
    email: string;
}

export function generateToken(payload: JWTPayload): string {
    // @ts-ignore
    return jwt.sign(payload, JWT_SECRET as string, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

export function verifyToken(token: string): JWTPayload | Error {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return new Error("JWT Verification Error");
    }
}

export function decodeToken(token: string): JWTPayload | string {
    try {
        const decoded = jwt.decode(token) as JWTPayload;
        return decoded;
    } catch (error) {
        return "JWT Decode Error";
    }
}
