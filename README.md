# 🌟 EduGenie — Google Gemini Powered Learning Assistant

**EduGenie** is a production-grade, full-stack AI-powered educational platform powered by the **Google Gemini API**. It helps students and educators understand difficult academic concepts, generate structured master notes, run interactive timed practice quizzes, create active recall flashcards, synthesize concise study summaries, plan personalized study schedules, and chat directly with uploaded learning materials.

---

## 🚀 Key Features

### 1. 🤖 Interactive AI Tutor
- **Adaptive Explanation Levels**:
  - **Beginner**: Intuitive real-world analogies, everyday examples, and plain terminology.
  - **Intermediate**: Balanced academic depth, formal concepts, and practical system flows.
  - **Advanced**: Rigorous theoretical depth, mathematical formulations, and system mechanisms.
- **Rich Markdown Formatting**: Headings, bulleted concepts, copyable syntax-highlighted code blocks, and mathematical expressions.
- **Voice Synthesis (Read Aloud)**: Web Speech API voice synthesis to listen to tutor explanations hands-free.
- **Dynamic Follow-Up Questions**: Automatic generation of 3 intelligent follow-up inquiries to stimulate critical thinking.
- **Session History & Notebook Saving**: Save valuable answers directly into your personal study notebook.

### 2. 📚 Smart Study Tools
- **📝 AI Study Summarizer**: Paste long textbook excerpts or research papers to extract executive summaries, key bullet points, keyword glossaries, and high-yield takeaways.
- **🎓 Master Notes Generator**: Enter any topic to generate structured academic study notes containing:
  - Executive Overview
  - Core Conceptual Pillars with sub-points
  - Essential Definitions
  - Real-World Case Studies
  - High-Yield Exam Points & Traps
  - Quick Revision Checklists
- **❓ Interactive Quiz Generator**: Create custom practice tests with Multiple Choice and True/False questions. Features timed test runner, instant score grading, confetti celebration, and in-depth explanations for every option.
- **🎴 Active Recall Flashcards**: Flip cards with 3D animation, hint toggle, shuffle mode, keyboard shortcuts (Space to flip, arrows to navigate), and mastery tracking.
- **📅 Study Timetable Planner**: Generate day-by-day milestone roadmaps based on available study hours per day, target exam dates, and priority weak areas.

### 3. 📄 Document AI & Learning Materials
- Upload PDFs, TXT files, Markdown notes, or DOCX documents (up to 10MB).
- Grounded Q&A: Ask questions directly against the uploaded document with citation snippets and concept breakdowns.

### 4. 📊 Progress & Analytics
- Track study consistency, question counts, quiz accuracy percentages, flashcard mastery rates, and weekly study hours distribution.

### 5. 🔒 Security & Architecture
- **Protected API Keys**: `GEMINI_API_KEY` is strictly managed server-side and never exposed to the client.
- **Custom In-App Key Mode**: Allows students to provide their personal Google AI Studio key via encrypted request headers if preferred.
- **Built-in Fallback Engine**: Seamless fallback mechanism ensures zero crashes even if offline or before API key configuration.
- **Token-Bucket Rate Limiting**: Protects backend endpoints against abuse.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React icons
- **AI SDK**: Google Gemini Generative AI SDK (`@google/generative-ai`)
- **Animation & Interactivity**: Canvas Confetti, Framer Motion, Web Speech API
- **Markdown**: `react-markdown`, `remark-gfm`

---

## 📁 Project Architecture

```
edugenie/
├── app/
│   ├── layout.tsx                # Root layout with fonts & metadata
│   ├── page.tsx                  # High-conversion Landing Page
│   ├── globals.css               # Design system & dark theme tokens
│   ├── dashboard/                # Main Student Dashboard
│   ├── tutor/                    # AI Tutor Chat with 3 depth modes
│   ├── tools/
│   │   ├── summarizer/           # Smart Summarizer Tool
│   │   ├── notes/                # Master Notes Generator Tool
│   │   ├── quiz/                 # Interactive Quiz Tool
│   │   ├── flashcards/           # 3D Flip Flashcards Tool
│   │   └── study-plan/           # Study Timetable Planner Tool
│   ├── documents/                # Document AI & Grounded Q&A
│   ├── saved/                    # Personal Notebook & Saved Repository
│   ├── progress/                 # Analytics & Mastery Metrics
│   ├── settings/                 # API Key & Preferences Configuration
│   └── api/
│       ├── ai/                   # AI Endpoints (Chat, Summarize, Notes, Quiz, etc.)
│       ├── documents/upload/     # Document parser and uploader
│       └── health/               # Server diagnostics endpoint
├── backend/
│   ├── services/
│   │   ├── gemini.service.ts     # Google Gemini API client & fallback generator
│   │   └── prompt-templates.ts   # System prompts & pedagogical prompt templates
│   ├── utils/
│   │   ├── rate-limiter.ts       # In-memory token bucket rate limiter
│   │   └── validator.ts          # JSON sanitization and parameter validator
│   └── types/
│       └── ai.types.ts
├── components/
│   ├── layout/                   # Sidebar, Navbar, MobileNav, AppLayout
│   ├── landing/                  # Hero, FeatureGrid, InteractiveDemo, Testimonials
│   ├── tutor/                    # ChatInterface, ExplanationLevelSelector, MarkdownRenderer
│   ├── tools/                    # Tool components (Summarizer, Notes, Quiz, Flashcards, Plan)
│   ├── documents/                # DocumentManager, DocumentChat
│   ├── dashboard/                # StatsOverview, QuickActions, RecentActivity, Streak
│   ├── ui/                       # Button, Card, Badge, Modal, Skeleton
│   └── shared/                   # ApiKeyModal
├── lib/
│   ├── storage.ts                # Client storage & localStorage manager
│   ├── sample-data.ts            # High-yield initial educational data
│   └── utils.ts                  # Helper utilities & class merger
├── types/
│   └── index.ts                  # Comprehensive TypeScript interfaces
├── .env.example
├── README.md
└── package.json
```

---

## ⚡ Quick Start & Installation

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd edugenie
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> **Tip:** You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/ai/chat` | `POST` | AI Tutor conversation with adaptive depth |
| `/api/ai/summarize` | `POST` | Extracts summaries, bullet points, and key terms |
| `/api/ai/notes` | `POST` | Generates 6-section academic master study notes |
| `/api/ai/quiz` | `POST` | Generates MCQ and True/False practice quizzes |
| `/api/ai/flashcards` | `POST` | Generates active recall flashcards |
| `/api/ai/study-plan` | `POST` | Generates personalized study schedules |
| `/api/ai/document-qa` | `POST` | Grounded Q&A on uploaded document content |
| `/api/documents/upload` | `POST` | Uploads and extracts text from documents |
| `/api/health` | `GET` | Health check and Gemini configuration status |

---

## 🎓 Pedagogical Rules

1. Explain concepts strictly according to the student's selected level (Beginner, Intermediate, Advanced).
2. Prefer clear, structured, well-formatted explanations using Markdown.
3. Always provide intuitive real-world examples and analogies.
4. Encourage active understanding rather than passive memorization.
5. Provide step-by-step reasoning for calculations and clean examples for programming questions.

---

## 📄 License
MIT License. Built for students and educators worldwide.
