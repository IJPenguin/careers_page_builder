import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
    try {
        const { text, type } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Gemini API key not configured" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompts: Record<string, string> = {
            about: `Rewrite the following company "About Us" section to be more engaging, professional, and SEO-optimized. Improve clarity, highlight value, and naturally incorporate relevant keywords. The output must be at least one paragraph of 5 or more sentences. Provide ONLY the final rewritten text, without explanations or alternative versions:\n\n${text}`,

            description: `Rewrite the following description to be clearer, more compelling, and SEO-optimized while preserving the original meaning. Enhance readability, flow, and keyword relevance. The output must be at least one paragraph of 5 or more sentences. Provide ONLY the final rewritten text without commentary, bullets, or extra notes:\n\n${text}`,

            lifeAtCompany: `Rewrite the following "Life at Company" section to be vibrant, appealing, and SEO-optimized, showcasing culture, growth, benefits, and employer branding. The output must be at least one paragraph of 5 or more sentences. Provide ONLY the final rewritten text without commentary or multiple versions:\n\n${text}`,

            default: `Rewrite the following text to make it more professional, engaging, and SEO-optimized while maintaining clarity and intent. The output must be at least one paragraph of 5 or more sentences. Provide ONLY the final rewritten text, without explanation or formatting beyond standard paragraphs:\n\n${text}`,
        };

        const prompt = prompts[type || "default"] || prompts.default;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rewrittenText = response.text();

        return NextResponse.json({ rewrittenText });
    } catch (error) {
        console.error("AI Rewrite error:", error);
        return NextResponse.json(
            { error: "Failed to rewrite text" },
            { status: 500 }
        );
    }
}
