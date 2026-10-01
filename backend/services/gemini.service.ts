import { GoogleGenerativeAI } from "@google/generative-ai";
import { cleanJsonResponse } from "../utils/validator";
import { EDUGENIE_SYSTEM_INSTRUCTION } from "./prompt-templates";
import {
  ExplanationLevel,
  FlashcardDeck,
  NotesResult,
  Quiz,
  QuizDifficulty,
  QuizQuestionType,
  StudyPlan,
  SummaryResult,
} from "@/types";

interface GeminiGenerateOptions {
  prompt: string;
  systemInstruction?: string;
  customApiKey?: string;
  temperature?: number;
  modelName?: string;
}

export class GeminiService {
  private static getApiKey(customApiKey?: string): string | undefined {
    return (
      customApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY
    );
  }

  /**
   * Generates text using Google Gemini API with fallback to intelligent mock generator
   */
  public static async generateText(
    options: GeminiGenerateOptions
  ): Promise<string> {
    const apiKey = this.getApiKey(options.customApiKey);
    const modelName =
      options.modelName || process.env.GEMINI_MODEL || "gemini-2.0-flash";

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      console.warn(
        "[GeminiService] No GEMINI_API_KEY found or default placeholder detected. Utilizing EduGenie academic AI fallback engine."
      );
      return this.generateMockFallbackText(options.prompt);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: options.systemInstruction || EDUGENIE_SYSTEM_INSTRUCTION,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
        },
      });

      const result = await model.generateContent(options.prompt);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      console.error("[GeminiService] Live Gemini API error:", error?.message || error);
      // If 404 or model not found, try fallback to gemini-1.5-flash
      if (modelName !== "gemini-1.5-flash" && apiKey) {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const fallbackModel = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction:
              options.systemInstruction || EDUGENIE_SYSTEM_INSTRUCTION,
          });
          const result = await fallbackModel.generateContent(options.prompt);
          const response = await result.response;
          return response.text();
        } catch (innerErr) {
          console.error("[GeminiService] Fallback to gemini-1.5-flash also failed:", innerErr);
        }
      }

      // If network or quota error, provide high-quality educational fallback
      return this.generateMockFallbackText(options.prompt);
    }
  }

  /**
   * Generates structured JSON output from Gemini API
   */
  public static async generateStructuredJson<T>(
    options: GeminiGenerateOptions,
    fallbackGenerator: () => T
  ): Promise<T> {
    const apiKey = this.getApiKey(options.customApiKey);

    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return fallbackGenerator();
    }

    try {
      const rawText = await this.generateText({
        ...options,
        temperature: options.temperature ?? 0.3,
      });

      const jsonStr = cleanJsonResponse(rawText);
      const parsed = JSON.parse(jsonStr) as T;
      return parsed;
    } catch (err) {
      console.error("[GeminiService] Failed to parse structured JSON from Gemini, using fallback:", err);
      return fallbackGenerator();
    }
  }

  /**
   * Academic generator fallback when API key is not yet set or during offline testing
   */
  private static generateMockFallbackText(prompt: string): string {
    const lower = prompt.toLowerCase();

    if (lower.includes("photosynthesis")) {
      return `### 💡 Core Intuition
**Photosynthesis** is the miraculous biochemical engine of Earth: plants, algae, and cyanobacteria absorb sunlight, carbon dioxide ($CO_2$), and water ($H_2O$) to produce energy-rich glucose ($C_6H_{12}O_6$) and release vital oxygen ($O_2$).

---

### 📖 Detailed Explanation

The overall balanced chemical equation is:
$$6CO_2 + 6H_2O + \\text{photons} \\rightarrow C_6H_{12}O_6 + 6O_2$$

Photosynthesis occurs inside **chloroplasts** across two coordinated stages:

1. **Light-Dependent Reactions (in the Thylakoid membranes):**
   - Chlorophyll pigments absorb solar photons, exciting electrons.
   - Water molecules are split (**photolysis**), releasing $O_2$ as a byproduct and freeing protons ($H^+$).
   - Electron Transport Chains pump protons to create an electrochemical gradient, generating **ATP** and **NADPH**.

2. **Light-Independent Reactions / Calvin Cycle (in the Stroma):**
   - **Carbon Fixation:** The enzyme **RuBisCO** incorporates atmospheric $CO_2$ into ribulose-1,5-bisphosphate (RuBP).
   - **Reduction:** ATP and NADPH convert 3-PGA into glyceraldehyde-3-phosphate (G3P).
   - **Regeneration:** G3P molecules synthesize glucose, while remaining molecules regenerate RuBP.

---

### 🌟 Real-World Example & Analogy
Think of a chloroplast as a **solar-powered molecular kitchen**:
- **Sunlight** = The electricity powering the kitchen appliances.
- **$CO_2$ & Water** = Raw ingredients shipped from the environment.
- **Glucose** = Freshly baked bread stored in pantries for sustained cellular fuel.
- **Oxygen** = Pleasant aroma vented into the atmosphere.

---

### 🔑 Key Takeaways & Exam Points
- **Location:** Light reactions $\\rightarrow$ Thylakoids; Calvin Cycle $\\rightarrow$ Stroma.
- **Limiting Factors:** Light intensity, $CO_2$ concentration, and ambient temperature.
- **Crucial Enzyme:** RuBisCO is the most abundant protein on planet Earth.

---

### Suggested Next Questions
- How does photorespiration limit the efficiency of C3 plants?
- What structural adaptations do C4 and CAM plants use in arid climates?
- Can artificial photosynthesis solve global clean energy storage?`;
    }

    // Generic educational breakdown
    return `### 💡 Core Intuition
This concept represents a fundamental principle in modern academics. It connects theoretical foundations with practical, measurable phenomena in real-world systems.

---

### 📖 Detailed Explanation

1. **Fundamental Definition:**
   The topic revolves around structured systems where input parameters directly determine the state, efficiency, and predictable outcomes of the overall process.

2. **Core Mechanisms:**
   - **Phase 1 (Initialization & Input):** Ingestion of source signals, data, or raw energy.
   - **Phase 2 (Processing & Transformation):** Applying mathematical, logical, or physical transformations.
   - **Phase 3 (Output & Equilibrium):** Delivery of stable outputs, byproducts, and feedback loops.

3. **Key Properties:**
   - **Conservation & Efficiency:** Minimizing entropy and friction during transitions.
   - **Scalability:** How the system responds under varying load or complexity.

---

### 🌟 Real-World Example
Consider an intelligent automated traffic control network: sensors dynamically measure queue lengths (inputs), adjust phase timing via algorithms (process), and maximize throughput while minimizing congestion (outcome).

---

### 🔑 Key Takeaways
- Always identify boundary conditions and constraints first.
- Break multifaceted problems into decoupled sub-components.
- Verify assumptions against experimental and empirical benchmarks.

---

### Suggested Next Questions
- How can we mathematically model the efficiency of this system?
- What are the most common edge cases and points of failure?
- How does this interact with related cross-disciplinary domains?`;
  }

  // Fallback Mock Data Generators for Tools
  public static mockSummary(text: string): SummaryResult {
    const words = text.split(/\s+/).filter(Boolean);
    const title = words.slice(0, 5).join(" ") || "Study Material";
    return {
      summary: `This material covers key foundational principles surrounding ${title}. It highlights critical mechanisms, architectural flows, and essential practical applications necessary for academic mastery.`,
      bulletPoints: [
        "Establishes fundamental terminology and governing equations or definitions.",
        "Explores structural components and their functional interdependencies.",
        "Analyzes practical use cases, real-world case studies, and performance trade-offs.",
        "Provides actionable takeaways for exam preparation and conceptual retention.",
      ],
      keywords: [
        {
          term: words[0] || "Foundations",
          definition: "The core theoretical framework underpinning this subject.",
        },
        {
          term: words[1] || "Mechanism",
          definition: "The systematic sequence of operations that drives the process.",
        },
        {
          term: words[2] || "Optimization",
          definition: "Techniques employed to maximize efficiency and eliminate bottlenecks.",
        },
      ],
      keyTakeaways: [
        "Master the foundational terminology before tackling advanced derivations.",
        "Pay special attention to boundary conditions and common exam traps.",
        "Connect theoretical formulas to observable real-world phenomena.",
      ],
      sourceTextPreview: text.slice(0, 200) + "...",
    };
  }

  public static mockNotes(topic: string): NotesResult {
    return {
      title: `Master Study Notes: ${topic}`,
      topic: topic,
      overview: `${topic} is a cornerstone subject in modern curricula. Understanding its fundamental principles unlocks advanced problem solving, systems analysis, and analytical thinking.`,
      keyConcepts: [
        {
          title: "Core Architecture & Mechanisms",
          explanation: `The foundational architecture of ${topic} relies on tightly coupled sub-systems working in harmony to maintain stability and throughput.`,
          subPoints: [
            "Primary state transitions and invariant constraints",
            "Input processing, routing, and error boundaries",
            "Feedback mechanisms and convergence criteria",
          ],
        },
        {
          title: "Mathematical & Theoretical Underpinnings",
          explanation: `Formal models enable precise calculation of operational thresholds, runtime complexities, and efficiency limits in ${topic}.`,
          subPoints: [
            "Standard mathematical formulations and proofs",
            "Asymptotic analysis and upper/lower bounds",
          ],
        },
        {
          title: "Contemporary Applications & Standards",
          explanation: `Modern industry and academic research apply these concepts across software, hardware, and physical sciences.`,
          subPoints: [
            "Integration with distributed modern ecosystems",
            "Standard compliance and testing methodologies",
          ],
        },
      ],
      definitions: [
        {
          term: `${topic} Protocol/Law`,
          definition: "The standardized set of rules governing interactions and state changes.",
        },
        {
          term: "Throughput",
          definition: "The rate at which successful work units are completed per unit time.",
        },
        {
          term: "Latency / Overhead",
          definition: "The time delay between request initiation and complete fulfillment.",
        },
      ],
      examples: [
        {
          title: "Real-World Deployment Scenario",
          scenario: `In a high-scale production environment, applying ${topic} helped reduce system latency by 42% while guaranteeing fault tolerance across nodes.`,
          keyTakeaway: "Modular separation of concerns prevents cascading failures.",
        },
      ],
      examPoints: [
        `High probability question: Explain the trade-offs between speed and consistency in ${topic}.`,
        "Common misconception: Confusing transient errors with permanent system failures.",
        "Always memorize the core 3 formulas and state diagrams for quick calculation.",
      ],
      quickRevision: [
        `Definition: ${topic} organizes complex flows into predictable, verifiable steps.`,
        "Primary trade-off: Latency vs. Resource Utilization.",
        "Key formula: Efficiency = (Useful Work Output / Total Energy Input) * 100%.",
        "Best practice: Always benchmark against baseline constraints.",
      ],
    };
  }

  public static mockQuiz(
    topic: string,
    count: number = 5,
    difficulty: QuizDifficulty = "medium",
    type: QuizQuestionType = "mcq"
  ): Quiz {
    const questions = [];
    for (let i = 1; i <= count; i++) {
      if (type === "true_false") {
        questions.push({
          id: `q_${i}`,
          question: `In ${topic}, statement ${i}: System efficiency is fundamentally bounded by thermodynamic or algorithmic constraints?`,
          options: ["True", "False"],
          correctAnswerIndex: 0,
          explanation:
            "True. All physical and computational systems are governed by upper mathematical bounds (such as Carnot efficiency or asymptotic complexity limits).",
          type: "true_false" as QuizQuestionType,
        });
      } else {
        questions.push({
          id: `q_${i}`,
          question: `Regarding ${topic}, which of the following best describes the primary role of mechanism ${i}?`,
          options: [
            `Option A: It regulates state transitions and ensures consistency across nodes`,
            `Option B: It bypasses all validation checks to increase raw transfer speed`,
            `Option C: It permanently deletes cache entries without verification`,
            `Option D: It is only used in legacy hardware systems and is deprecated`,
          ],
          correctAnswerIndex: 0,
          explanation:
            "Option A is correct because proper state transition management guarantees data integrity and prevents race conditions under load.",
          type: "mcq" as QuizQuestionType,
        });
      }
    }

    return {
      id: `quiz_${Date.now()}`,
      topic,
      difficulty,
      type,
      questions,
      createdAt: new Date().toISOString(),
    };
  }

  public static mockFlashcards(topic: string, count: number = 6): FlashcardDeck {
    const cards = [
      {
        id: "fc_1",
        front: `What is the core definition of ${topic}?`,
        back: `${topic} is a structured academic and scientific discipline focused on analyzing, modeling, and optimizing state interactions.`,
        hint: "Think about the overarching purpose and scope.",
        status: "new" as const,
      },
      {
        id: "fc_2",
        front: `What is the primary governing law or equation in ${topic}?`,
        back: "It balances conservation of energy/information with minimization of entropy and runtime latency.",
        hint: "Related to efficiency and conservation.",
        status: "new" as const,
      },
      {
        id: "fc_3",
        front: `What is the difference between active and passive mechanisms in ${topic}?`,
        back: "Active mechanisms consume internal energy to drive state changes; passive mechanisms rely on external gradients and equilibrium.",
        hint: "Energy consumption vs gradient flow.",
        status: "new" as const,
      },
      {
        id: "fc_4",
        front: `What is the most common exam trap or misconception in ${topic}?`,
        back: "Assuming ideal conditions (zero friction, zero latency, instantaneous propagation) without accounting for boundary constraints.",
        hint: "Real-world friction vs ideal models.",
        status: "new" as const,
      },
      {
        id: "fc_5",
        front: `How do you calculate the overall efficiency in ${topic}?`,
        back: "Efficiency = (Output Work / Total Input Energy) × 100%.",
        hint: "Output divided by Input.",
        status: "new" as const,
      },
      {
        id: "fc_6",
        front: `Name one modern real-world application of ${topic}.`,
        back: "Distributed computing clusters, aerospace propulsion systems, and biomedical sensor networks.",
        hint: "High-reliability engineering domains.",
        status: "new" as const,
      },
    ];

    return {
      id: `deck_${Date.now()}`,
      title: `Flashcards: ${topic}`,
      topic: topic,
      cards: cards.slice(0, count),
      createdAt: new Date().toISOString(),
    };
  }

  public static mockStudyPlan(
    subjects: string[],
    hours: number,
    examDate: string
  ): StudyPlan {
    const subList = subjects.length > 0 ? subjects : ["Core Topic", "Revision"];
    return {
      id: `plan_${Date.now()}`,
      title: `High-Yield Master Study Schedule (${subList.join(", ")})`,
      subjects: subList,
      availableHoursPerDay: hours,
      examDate: examDate || "Upcoming Exam",
      difficultyAreas: ["Core Foundations", "Problem Sets"],
      days: [
        {
          dayNumber: 1,
          dayTitle: "Day 1: Theoretical Foundations & Notes Mastery",
          focusSubjects: [subList[0] || "Core Subject"],
          tasks: [
            {
              id: "t_1_1",
              title: `Read lecture chapters on ${subList[0] || "Core Subject"}`,
              duration: `${Math.round(hours * 0.4 * 60)} mins`,
              completed: false,
              type: "reading",
            },
            {
              id: "t_1_2",
              title: "Generate structured notes & summarize key formulas",
              duration: `${Math.round(hours * 0.3 * 60)} mins`,
              completed: false,
              type: "revision",
            },
            {
              id: "t_1_3",
              title: "Self-test with 10 Flashcards",
              duration: `${Math.round(hours * 0.3 * 60)} mins`,
              completed: false,
              type: "practice",
            },
          ],
          dailyTip:
            "Active Recall tip: Write down everything you remember on a blank page before reviewing your notes.",
        },
        {
          dayNumber: 2,
          dayTitle: "Day 2: Deep Problem Solving & Practice Sets",
          focusSubjects: [subList[1] || subList[0] || "Core Subject"],
          tasks: [
            {
              id: "t_2_1",
              title: "Solve high-difficulty problem sets from previous exams",
              duration: `${Math.round(hours * 0.5 * 60)} mins`,
              completed: false,
              type: "practice",
            },
            {
              id: "t_2_2",
              title: "Review incorrect answers and document root causes",
              duration: `${Math.round(hours * 0.3 * 60)} mins`,
              completed: false,
              type: "revision",
            },
            {
              id: "t_2_3",
              title: "Take a 15-minute timed quiz",
              duration: `${Math.round(hours * 0.2 * 60)} mins`,
              completed: false,
              type: "quiz",
            },
          ],
          dailyTip:
            "Feynman Technique: Explain difficult concepts out loud as if teaching a beginner.",
        },
        {
          dayNumber: 3,
          dayTitle: "Day 3: Comprehensive Review & Mock Exam",
          focusSubjects: subList,
          tasks: [
            {
              id: "t_3_1",
              title: "Full syllabus timed mock test under exam conditions",
              duration: `${Math.round(hours * 0.6 * 60)} mins`,
              completed: false,
              type: "quiz",
            },
            {
              id: "t_3_2",
              title: "Final formula sheet review and flashcard mastery check",
              duration: `${Math.round(hours * 0.4 * 60)} mins`,
              completed: false,
              type: "revision",
            },
          ],
          dailyTip:
            "Spaced Repetition: Rest well before exam day; cognitive consolidation occurs during sleep.",
        },
      ],
      createdAt: new Date().toISOString(),
    };
  }
}
