export type ExplanationLevel = "beginner" | "intermediate" | "advanced";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  explanationLevel?: ExplanationLevel;
  followUps?: string[];
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  topic?: string;
  explanationLevel: ExplanationLevel;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface KeywordItem {
  term: string;
  definition: string;
}

export interface SummaryResult {
  summary: string;
  bulletPoints: string[];
  keywords: KeywordItem[];
  keyTakeaways: string[];
  sourceTextPreview?: string;
}

export interface NoteConcept {
  title: string;
  explanation: string;
  subPoints?: string[];
}

export interface NoteExample {
  title: string;
  scenario: string;
  keyTakeaway: string;
}

export interface NotesResult {
  title: string;
  topic: string;
  overview: string;
  keyConcepts: NoteConcept[];
  definitions: KeywordItem[];
  examples: NoteExample[];
  examPoints: string[];
  quickRevision: string[];
}

export type QuizQuestionType = "mcq" | "true_false" | "short_answer";
export type QuizDifficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  type: QuizQuestionType;
}

export interface Quiz {
  id: string;
  topic: string;
  difficulty: QuizDifficulty;
  type: QuizQuestionType;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizSubmission {
  quizId: string;
  quizTopic: string;
  score: number;
  totalQuestions: number;
  userAnswers: Record<string, number | string>;
  completedAt: string;
  percentage: number;
  timeSpentSeconds: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  status: "new" | "learning" | "mastered";
}

export interface FlashcardDeck {
  id: string;
  title: string;
  topic: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface StudyPlanTask {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: "reading" | "practice" | "revision" | "quiz";
}

export interface StudyPlanDay {
  dayNumber: number;
  dayTitle: string;
  focusSubjects: string[];
  tasks: StudyPlanTask[];
  dailyTip: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  subjects: string[];
  availableHoursPerDay: number;
  examDate: string;
  difficultyAreas: string[];
  days: StudyPlanDay[];
  createdAt: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  content: string;
  summary?: string;
  keyTopics?: string[];
}

export interface DocumentMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  timestamp: string;
}

export type SavedContentType =
  | "note"
  | "summary"
  | "quiz"
  | "flashcard"
  | "plan"
  | "chat";

export interface SavedItem {
  id: string;
  type: SavedContentType;
  title: string;
  content: any;
  tags: string[];
  createdAt: string;
}

export interface StudyActivity {
  id: string;
  type:
    | "tutor_ask"
    | "quiz_taken"
    | "notes_generated"
    | "summary_created"
    | "flashcards_reviewed"
    | "doc_analyzed";
  title: string;
  details: string;
  timestamp: string;
}

export interface UserStats {
  questionsAsked: number;
  quizzesCompleted: number;
  studyHours: number;
  streakDays: number;
  accuracyRate: number;
  cardsMastered: number;
  lastActiveDate: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error?: {
    message: string;
    code?: string;
  } | null;
}
