import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/backend/services/gemini.service";
import {
  EDUGENIE_SYSTEM_INSTRUCTION,
  getTutorPrompt,
} from "@/backend/services/prompt-templates";
import { checkRateLimit } from "@/backend/utils/rate-limiter";
import { ApiResponse, ExplanationLevel } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous_user";
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          data: null,
          error: { message: "Too many requests. Please wait a moment before asking again." },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { question, level = "intermediate", history = [] } = body;

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

    const customKey = req.headers.get("x-gemini-key") || undefined;
    const prompt = getTutorPrompt(question.trim(), level as ExplanationLevel, history);

    const responseText = await GeminiService.generateText({
      prompt,
      systemInstruction: EDUGENIE_SYSTEM_INSTRUCTION,
      customApiKey: customKey,
      temperature: 0.7,
    });

    // Extract suggested follow-ups if present
    const followUps: string[] = [];
    const followUpSection = responseText.split(/###\s*(?:Suggested Next Questions|Follow-up Questions)/i)[1];
    if (followUpSection) {
      const lines = followUpSection.split("\n");
      for (const line of lines) {
        const trimmed = line.trim().replace(/^[-*•\d.]+\s*/, "");
        if (trimmed && trimmed.length > 5 && trimmed.length < 150) {
          followUps.push(trimmed);
          if (followUps.length >= 3) break;
        }
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        text: responseText,
        explanationLevel: level,
        followUps:
          followUps.length > 0
            ? followUps
            : [
                `Can you explain this with another practical example?`,
                `What are the most common exam questions on this topic?`,
                `How does this connect to real-world applications?`,
              ],
      },
      error: null,
    });
  } catch (error: any) {
    console.error("[API/chat] Error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        data: null,
        error: { message: error?.message || "Failed to generate tutor response." },
      },
      { status: 500 }
    );
  }
}
