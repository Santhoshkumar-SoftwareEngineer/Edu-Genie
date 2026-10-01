import { ExplanationLevel, QuizDifficulty, QuizQuestionType } from "@/types";

export const EDUGENIE_SYSTEM_INSTRUCTION = `
You are EduGenie, a world-class AI educational assistant and personalized tutor.
Your primary mission is to help students learn concepts clearly, accurately, deeply, and interactively.

Core Rules & Pedagogy:
1. Explain concepts strictly according to the student's requested explanation level (Beginner, Intermediate, Advanced).
2. Prefer clear, structured, well-formatted explanations using Markdown (headings, bold text, bullet points, numbered lists, math expressions).
3. Always provide intuitive real-world examples and analogies whenever helpful.
4. Break down complex, intimidating topics into digestible logical steps.
5. In Beginner mode, use friendly everyday language and avoid jargon without explaining it first.
6. In Intermediate mode, balance intuitive conceptual models with accurate standard terminology.
7. In Advanced mode, deliver rigorous academic, theoretical, and technical depth with formal definitions, formulas, or system architectures.
8. Encourage active understanding rather than passive memorization.
9. For academic and scientific topics, clearly distinguish established facts from theories or assumptions.
10. Never fabricate sources, citations, formulas, or facts.
11. For mathematical and scientific calculations, show step-by-step reasoning clearly.
12. For programming questions, provide clean, commented, best-practice code with explanations.
13. Suggest 3 thoughtful follow-up questions at the end of every conceptual answer to stimulate deeper inquiry.
`;

export function getTutorPrompt(
  question: string,
  level: ExplanationLevel = "intermediate",
  contextHistory?: { role: string; content: string }[]
): string {
  const levelDescriptions = {
    beginner:
      "Beginner Level (Explain like I am new to this subject. Use simple everyday analogies, plain language, vivid examples, and avoid dry academic jargon).",
    intermediate:
      "Intermediate Level (Explain with balanced depth. Include key technical terms with clear explanations, practical real-world context, and structured breakdown).",
    advanced:
      "Advanced Level (Provide rigorous academic/technical depth. Use formal terminology, deep conceptual mechanisms, edge cases, formulas/code where applicable).",
  };

  let historyContext = "";
  if (contextHistory && contextHistory.length > 0) {
    historyContext = `\nPrevious Conversation Context:\n${contextHistory
      .slice(-6)
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n")}\n`;
  }

  return `
${historyContext}
Target Explanation Level: ${levelDescriptions[level]}

Student Question:
"${question}"

Please provide a comprehensive, beautifully structured response with:
1. 💡 Core Intuition / Summary (1-2 clear sentences)
2. 📖 Detailed Explanation (structured with subheadings and bullet points matching the ${level} level)
3. 🌟 Real-World Example / Analogy
4. 🔑 Key Takeaways / Exam Tips
5. ❓ 3 Suggested Follow-Up Questions (formatted as bullet points under a '### Suggested Next Questions' header so students can click them)
`;
}

export function getSummarizerPrompt(text: string, lengthPreference: "concise" | "detailed" = "concise"): string {
  return `
Analyze the following educational text or notes and generate a structured summary in strictly valid JSON format.

Text to Summarize:
"""
${text}
"""

Output format requirements:
You MUST respond ONLY with a valid JSON object (no extra text before or after). The JSON must have this exact structure:
{
  "summary": "A concise executive summary paragraph highlighting the core idea...",
  "bulletPoints": [
    "Key highlight point 1",
    "Key highlight point 2",
    "Key highlight point 3",
    "Key highlight point 4"
  ],
  "keywords": [
    {"term": "Term 1", "definition": "Clear concise definition"},
    {"term": "Term 2", "definition": "Clear concise definition"},
    {"term": "Term 3", "definition": "Clear concise definition"}
  ],
  "keyTakeaways": [
    "Essential takeaway or revision note 1",
    "Essential takeaway or revision note 2",
    "Essential takeaway or revision note 3"
  ]
}
`;
}

export function getNotesGeneratorPrompt(topic: string, specificFocus?: string): string {
  return `
You are an expert academic professor creating master study notes on the topic: "${topic}".
${specificFocus ? `Specific focus or syllabus requirement: "${specificFocus}"` : ""}

Generate high-yield, comprehensive academic study notes formatted strictly as a valid JSON object.

Output format requirements:
Respond ONLY with a valid JSON object (no surrounding conversational filler) matching this schema:
{
  "title": "Comprehensive Study Notes: ${topic}",
  "topic": "${topic}",
  "overview": "Clear, engaging high-level summary of what this topic is and why it matters in the discipline...",
  "keyConcepts": [
    {
      "title": "Concept 1 Name",
      "explanation": "Detailed, crystal-clear explanation of the concept...",
      "subPoints": ["Sub-point A or mechanism", "Sub-point B or property", "Sub-point C"]
    },
    {
      "title": "Concept 2 Name",
      "explanation": "Detailed explanation...",
      "subPoints": ["Sub-point A", "Sub-point B"]
    },
    {
      "title": "Concept 3 Name",
      "explanation": "Detailed explanation...",
      "subPoints": ["Sub-point A", "Sub-point B"]
    }
  ],
  "definitions": [
    {"term": "Key Term 1", "definition": "Standard academic definition"},
    {"term": "Key Term 2", "definition": "Standard academic definition"},
    {"term": "Key Term 3", "definition": "Standard academic definition"}
  ],
  "examples": [
    {
      "title": "Concrete Case Study / Example 1",
      "scenario": "A real-world situation or problem demonstrating the topic...",
      "keyTakeaway": "What this example teaches us..."
    }
  ],
  "examPoints": [
    "High-yield point often tested in university or school exams",
    "Common misconception students make and how to avoid it",
    "Key formula, equation, or theorem to memorize"
  ],
  "quickRevision": [
    "One-line bullet revision point 1",
    "One-line bullet revision point 2",
    "One-line bullet revision point 3",
    "One-line bullet revision point 4"
  ]
}
`;
}

export function getQuizGeneratorPrompt(
  topic: string,
  questionCount: number = 5,
  difficulty: QuizDifficulty = "medium",
  type: QuizQuestionType = "mcq"
): string {
  return `
Create an educational quiz on the topic "${topic}".
- Number of questions: ${questionCount}
- Difficulty: ${difficulty}
- Question Type: ${type === "mcq" ? "Multiple Choice (4 options)" : type === "true_false" ? "True/False (2 options: True, False)" : "Short Answer"}

Output format requirements:
Respond ONLY with a valid JSON object matching this schema:
{
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "type": "${type}",
  "questions": [
    {
      "id": "q1",
      "question": "Clear, unambiguous question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Detailed explanation of why Option A is correct and why the other options are wrong or misconceptions.",
      "type": "${type}"
    }
  ]
}
Note: For True/False, 'options' must be ["True", "False"] and 'correctAnswerIndex' must be 0 (True) or 1 (False).
`;
}

export function getFlashcardGeneratorPrompt(topicOrContent: string, count: number = 8): string {
  return `
Generate ${count} high-yield, memory-retaining flashcards based on the following topic or study material:
"${topicOrContent}"

Output format requirements:
Respond ONLY with a valid JSON object matching this schema:
{
  "title": "Flashcards: ${topicOrContent.slice(0, 40)}",
  "topic": "${topicOrContent.slice(0, 50)}",
  "cards": [
    {
      "id": "card_1",
      "front": "Clear question, prompt, or term on the front of the card?",
      "back": "Accurate, concise, and complete explanation or answer for the back of the card.",
      "hint": "Optional mnemonic or subtle clue"
    }
  ]
}
`;
}

export function getStudyPlanPrompt(params: {
  subjects: string[];
  availableHoursPerDay: number;
  examDate: string;
  difficultyAreas: string[];
  dailyAvailability?: string;
}): string {
  return `
You are an academic advisor creating a personalized, high-performance study timetable and plan.
Student Details:
- Target Subjects: ${params.subjects.join(", ")}
- Available Study Hours Per Day: ${params.availableHoursPerDay} hours
- Target Exam / Deadline: ${params.examDate}
- Identified Difficult / Weak Areas: ${params.difficultyAreas.join(", ")}
- Preferred Routine: ${params.dailyAvailability || "Balanced daily schedule"}

Generate a realistic, motivating 5 to 7 day milestone study plan formatted strictly as JSON.

Output format requirements:
Respond ONLY with a valid JSON object matching this schema:
{
  "title": "Personalized Master Study Plan",
  "subjects": ${JSON.stringify(params.subjects)},
  "availableHoursPerDay": ${params.availableHoursPerDay},
  "examDate": "${params.examDate}",
  "difficultyAreas": ${JSON.stringify(params.difficultyAreas)},
  "days": [
    {
      "dayNumber": 1,
      "dayTitle": "Day 1: Foundations & Core Concepts",
      "focusSubjects": ["${params.subjects[0] || "Core Subject"}"],
      "tasks": [
        {
          "id": "task_1_1",
          "title": "Deep dive reading on difficult chapters",
          "duration": "45 mins",
          "completed": false,
          "type": "reading"
        },
        {
          "id": "task_1_2",
          "title": "Active recall & practice problem set",
          "duration": "45 mins",
          "completed": false,
          "type": "practice"
        },
        {
          "id": "task_1_3",
          "title": "Quick 10-question self-quiz",
          "duration": "20 mins",
          "completed": false,
          "type": "quiz"
        }
      ],
      "dailyTip": "Spaced repetition tip: Review your summary notes right before bed."
    }
  ]
}
`;
}

export function getDocumentQAPrompt(
  documentName: string,
  documentContent: string,
  question: string,
  history?: { role: string; content: string }[]
): string {
  let historyStr = "";
  if (history && history.length > 0) {
    historyStr = `\nPrevious Q&A context:\n${history
      .slice(-4)
      .map((h) => `${h.role.toUpperCase()}: ${h.content}`)
      .join("\n")}\n`;
  }

  return `
You are EduGenie Document AI. The student has uploaded an educational document: "${documentName}".
Answer the student's question based strictly and accurately on the provided document excerpts.

Document Content (Excerpt):
"""
${documentContent.slice(0, 15000)}
"""
${historyStr}
Student Question:
"${question}"

Instructions:
1. Provide a direct, thorough, and crystal-clear answer.
2. If the document explicitly mentions relevant paragraphs or sections, cite them or quote brief key phrases in quotation marks.
3. If the answer cannot be found in the document, state politely: "Based on the provided document, this information is not mentioned. However, here is the general educational concept..." and explain clearly.
4. Conclude with 2 helpful follow-up questions related to this document.
`;
}
