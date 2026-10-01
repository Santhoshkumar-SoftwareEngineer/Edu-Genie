import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/backend/services/gemini.service";
import { getDocumentQAPrompt } from "@/backend/services/prompt-templates";
import { checkRateLimit } from "@/backend/utils/rate-limiter";
import { ApiResponse } from "@/types";

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
    const { documentName, documentContent, question, history = [] } = body;

    if (!question || typeof question !== "string" || question.trim() === "") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          data: null,
          error: { message: "Question cannot be empty." },
        },
        { status: 400 }
      );
    }

    if (!documentContent || typeof documentContent !== "string") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          data: null,
          error: { message: "Document content is missing." },
        },
        { status: 400 }
      );
    }

    const customKey = req.headers.get("x-gemini-key") || undefined;
    const prompt = getDocumentQAPrompt(
      documentName || "Uploaded Document",
      documentContent,
      question.trim(),
      history
    );

    const answer = await GeminiService.generateText({
      prompt,
      customApiKey: customKey,
      temperature: 0.4,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        answer,
        documentName,
      },
      error: null,
    });
  } catch (error: any) {
    console.error("[API/document-qa] Error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        data: null,
        error: { message: error?.message || "Failed to analyze document question." },
      },
      { status: 500 }
    );
  }
}
