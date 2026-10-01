import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/backend/services/gemini.service";
import { getNotesGeneratorPrompt } from "@/backend/services/prompt-templates";
import { checkRateLimit } from "@/backend/utils/rate-limiter";
import { ApiResponse, NotesResult } from "@/types";

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
    const { topic, specificFocus } = body;

    if (!topic || typeof topic !== "string" || topic.trim() === "") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          data: null,
          error: { message: "Topic cannot be empty." },
        },
        { status: 400 }
      );
    }

    const customKey = req.headers.get("x-gemini-key") || undefined;
    const prompt = getNotesGeneratorPrompt(topic.trim(), specificFocus);

    const data = await GeminiService.generateStructuredJson<NotesResult>(
      {
        prompt,
        customApiKey: customKey,
      },
      () => GeminiService.mockNotes(topic)
    );

    return NextResponse.json<ApiResponse<NotesResult>>({
      success: true,
      data,
      error: null,
    });
  } catch (error: any) {
    console.error("[API/notes] Error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        data: null,
        error: { message: error?.message || "Failed to generate notes." },
      },
      { status: 500 }
    );
  }
}
