import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/backend/services/gemini.service";
import { getStudyPlanPrompt } from "@/backend/services/prompt-templates";
import { checkRateLimit } from "@/backend/utils/rate-limiter";
import { ApiResponse, StudyPlan } from "@/types";

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
      subjects = [],
      availableHoursPerDay = 3,
      examDate = "",
      difficultyAreas = [],
      dailyAvailability = "",
    } = body;

    const parsedSubjects = Array.isArray(subjects)
      ? subjects
      : typeof subjects === "string"
      ? subjects.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    if (parsedSubjects.length === 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          data: null,
          error: { message: "Please provide at least one subject for the study plan." },
        },
        { status: 400 }
      );
    }

    const customKey = req.headers.get("x-gemini-key") || undefined;
    const prompt = getStudyPlanPrompt({
      subjects: parsedSubjects,
      availableHoursPerDay: Number(availableHoursPerDay) || 3,
      examDate: examDate || "Within next 2 weeks",
      difficultyAreas: Array.isArray(difficultyAreas)
        ? difficultyAreas
        : typeof difficultyAreas === "string"
        ? difficultyAreas.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      dailyAvailability,
    });

    const data = await GeminiService.generateStructuredJson<StudyPlan>(
      {
        prompt,
        customApiKey: customKey,
      },
      () =>
        GeminiService.mockStudyPlan(
          parsedSubjects,
          Number(availableHoursPerDay) || 3,
          examDate
        )
    );

    if (data) {
      data.id = data.id || `plan_${Date.now()}`;
      data.createdAt = data.createdAt || new Date().toISOString();
    }

    return NextResponse.json<ApiResponse<StudyPlan>>({
      success: true,
      data,
      error: null,
    });
  } catch (error: any) {
    console.error("[API/study-plan] Error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        data: null,
        error: { message: error?.message || "Failed to generate study plan." },
      },
      { status: 500 }
    );
  }
}
