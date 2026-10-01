import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/backend/services/gemini.service";
import { getSummarizerPrompt } from "@/backend/services/prompt-templates";
import { checkRateLimit } from "@/backend/utils/rate-limiter";
import { ApiResponse, SummaryResult } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous_user";
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          data: null,
          error: { message: "Rate limit reached. Please wait a moment." },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { text, lengthPreference = "concise" } = body;

    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          data: null,
          error: { message: "Please provide at least 10 characters of text to summarize." },
        },
        { status: 400 }
      );
    }

    const customKey = req.headers.get("x-gemini-key") || undefined;
    const prompt = getSummarizerPrompt(text.trim(), lengthPreference);

    const data = await GeminiService.generateStructuredJson<SummaryResult>(
      {
        prompt,
        customApiKey: customKey,
      },
      () => GeminiService.mockSummary(text)
    );

    return NextResponse.json<ApiResponse<SummaryResult>>({
      success: true,
      data,
      error: null,
    });
  } catch (error: any) {
    console.error("[API/summarize] Error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        data: null,
        error: { message: error?.message || "Failed to generate summary." },
      },
      { status: 500 }
    );
  }
}
