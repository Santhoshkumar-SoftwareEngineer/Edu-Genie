import {
  Conversation,
  FlashcardDeck,
  NotesResult,
  Quiz,
  QuizSubmission,
  SavedItem,
  StudyActivity,
  StudyPlan,
  SummaryResult,
  UploadedDocument,
  UserStats,
} from "@/types";

const KEYS = {
  STATS: "edugenie_stats_v1",
  CONVERSATIONS: "edugenie_conversations_v1",
  ACTIVE_CONVO_ID: "edugenie_active_convo_id_v1",
  SAVED_ITEMS: "edugenie_saved_items_v1",
  DOCUMENTS: "edugenie_documents_v1",
  STUDY_PLANS: "edugenie_study_plans_v1",
  QUIZZES: "edugenie_quizzes_v1",
  QUIZ_RESULTS: "edugenie_quiz_results_v1",
  FLASHCARD_DECKS: "edugenie_flashcard_decks_v1",
  ACTIVITIES: "edugenie_activities_v1",
  CUSTOM_API_KEY: "edugenie_custom_api_key_v1",
  THEME: "edugenie_theme_v1",
};

export const defaultStats: UserStats = {
  questionsAsked: 128,
  quizzesCompleted: 24,
  studyHours: 18.5,
  streakDays: 7,
  accuracyRate: 88,
  cardsMastered: 45,
  lastActiveDate: new Date().toISOString(),
};

function isClient(): boolean {
  return typeof window !== "undefined";
}

export const Storage = {
  getStats(): UserStats {
    if (!isClient()) return defaultStats;
    try {
      const data = localStorage.getItem(KEYS.STATS);
      return data ? { ...defaultStats, ...JSON.parse(data) } : defaultStats;
    } catch {
      return defaultStats;
    }
  },

  setStats(stats: UserStats): void {
    if (!isClient()) return;
    try {
      localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  },

  incrementStat(key: keyof UserStats, delta: number = 1): UserStats {
    const current = this.getStats();
    const updated = {
      ...current,
      [key]: (Number(current[key]) || 0) + delta,
      lastActiveDate: new Date().toISOString(),
    };
    this.setStats(updated);
    return updated;
  },

  getConversations(): Conversation[] {
    if (!isClient()) return [];
    try {
      const data = localStorage.getItem(KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveConversation(convo: Conversation): void {
    if (!isClient()) return;
    try {
      const list = this.getConversations();
      const idx = list.findIndex((c) => c.id === convo.id);
      if (idx >= 0) {
        list[idx] = convo;
      } else {
        list.unshift(convo);
      }
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  },

  deleteConversation(id: string): void {
    if (!isClient()) return;
    try {
      const list = this.getConversations().filter((c) => c.id !== id);
      localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  },

  getSavedItems(): SavedItem[] {
    if (!isClient()) return [];
    try {
      const data = localStorage.getItem(KEYS.SAVED_ITEMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveItem(item: SavedItem): void {
    if (!isClient()) return;
    try {
      const list = this.getSavedItems();
      const filtered = list.filter((i) => i.id !== item.id);
      filtered.unshift(item);
      localStorage.setItem(KEYS.SAVED_ITEMS, JSON.stringify(filtered));
      this.addActivity({
        id: `act_${Date.now()}`,
        type: "notes_generated",
        title: `Saved: ${item.title}`,
        details: `Saved to personal notebook under ${item.type}`,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.error(e);
    }
  },

  deleteSavedItem(id: string): void {
    if (!isClient()) return;
    try {
      const list = this.getSavedItems().filter((i) => i.id !== id);
      localStorage.setItem(KEYS.SAVED_ITEMS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  },

  getDocuments(): UploadedDocument[] {
    if (!isClient()) return [];
    try {
      const data = localStorage.getItem(KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDocument(doc: UploadedDocument): void {
    if (!isClient()) return;
    try {
      const list = this.getDocuments();
      const filtered = list.filter((d) => d.id !== doc.id);
      filtered.unshift(doc);
      localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }
  },

  deleteDocument(id: string): void {
    if (!isClient()) return;
    try {
      const list = this.getDocuments().filter((d) => d.id !== id);
      localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  },

  getActivities(): StudyActivity[] {
    if (!isClient()) return [];
    try {
      const data = localStorage.getItem(KEYS.ACTIVITIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addActivity(act: StudyActivity): void {
    if (!isClient()) return;
    try {
      const list = this.getActivities();
      list.unshift(act);
      localStorage.setItem(KEYS.ACTIVITIES, JSON.stringify(list.slice(0, 30)));
    } catch (e) {
      console.error(e);
    }
  },

  getCustomApiKey(): string {
    if (!isClient()) return "";
    return localStorage.getItem(KEYS.CUSTOM_API_KEY) || "";
  },

  setCustomApiKey(key: string): void {
    if (!isClient()) return;
    localStorage.setItem(KEYS.CUSTOM_API_KEY, key.trim());
  },
};
