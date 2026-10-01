import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/backend/services/gemini.service";
import { getFlashcardGeneratorPrompt } from "@/backend/services/prompt-templates";
import { checkRateLimit } from "@/backend/utils/rate-limiter";
import { ApiResponse, FlashcardDeck } from "@/types";

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
    const { topicOrContent, count = 8 } = body;

    if (!topicOrContent || typeof topicOrContent !== "string" || topicOrContent.trim() === "") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          data: null,
          error: { message: "Topic or study content cannot be empty." },
        },
        { status: 400 }
      );
    }

    const customKey = req.headers.get("x-gemini-key") || undefined;
    const prompt = getFlashcardGeneratorPrompt(
      topicOrContent.trim(),
      Math.min(Math.max(Number(count) || 8, 3), 25)
    );

    const data = await GeminiService.generateStructuredJson<FlashcardDeck>(
      {
        prompt,
        customApiKey: customKey,
      },
      () =>
        GeminiService.mockFlashcards(
          topicOrContent.trim(),
          Math.min(Math.max(Number(count) || 8, 3), 25)
        )
    );

    if (data) {
      data.id = data.id || `deck_${Date.now()}`;
      data.createdAt = data.createdAt || new Date().toISOString();
      if (Array.isArray(data.cards)) {
        data.cards = data.cards.map((c, idx) => ({
          ...c,
          id: c.id || `fc_${idx + 1}`,
          status: c.status || "new",
        }));
      }
    }

    return NextResponse.json<ApiResponse<FlashcardDeck>>({
      success: true,
      data,
      error: null,
    });
  } catch (error: any) {
    console.error("[API/flashcards] Error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        data: null,
        error: { message: error?.message || "Failed to generate flashcards." },
      },
      { status: 500 }
    );
  }
}
