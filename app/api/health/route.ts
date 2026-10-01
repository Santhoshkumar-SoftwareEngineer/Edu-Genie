import { NextResponse } from "next/server";

export async function GET() {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here");
  return NextResponse.json({
    status: "healthy",
    service: "EduGenie AI Learning Assistant",
    version: "1.0.0",
    geminiConfigured: hasKey,
    model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    timestamp: new Date().toISOString(),
  });
}
