import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/backend/services/gemini.service";
import { getQuizGeneratorPrompt } from "@/backend/services/prompt-templates";
import { checkRateLimit } from "@/backend/utils/rate-limiter";
import { ApiResponse, Quiz, QuizDifficulty, QuizQuestionType } from "@/types";

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
    const {
      topic,
      count = 5,
      difficulty = "medium",
      type = "mcq",
    } = body;

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
    const prompt = getQuizGeneratorPrompt(
      topic.trim(),
      Math.min(Math.max(Number(count) || 5, 1), 20),
      difficulty as QuizDifficulty,
      type as QuizQuestionType
    );

    const data = await GeminiService.generateStructuredJson<Quiz>(
      {
        prompt,
        customApiKey: customKey,
      },
      () =>
        GeminiService.mockQuiz(
          topic,
          Number(count) || 5,
          difficulty as QuizDifficulty,
          type as QuizQuestionType
        )
    );

    // Ensure IDs and dates are present
    if (data) {
      data.id = data.id || `quiz_${Date.now()}`;
      data.createdAt = data.createdAt || new Date().toISOString();
      if (Array.isArray(data.questions)) {
        data.questions = data.questions.map((q, idx) => ({
          ...q,
          id: q.id || `q_${idx + 1}`,
          type: q.type || type,
        }));
      }
    }

    return NextResponse.json<ApiResponse<Quiz>>({
      success: true,
      data,
      error: null,
    });
  } catch (error: any) {
    console.error("[API/quiz] Error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        data: null,
        error: { message: error?.message || "Failed to generate quiz." },
      },
      { status: 500 }
    );
  }
}
