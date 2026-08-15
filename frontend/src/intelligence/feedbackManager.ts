import type { FeedbackRecord, FeedbackType } from "./types";

const STORAGE_KEY = "sarathi.intelligence.feedback";

let feedbackStore: FeedbackRecord[] = [];
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    feedbackStore = raw ? (JSON.parse(raw) as FeedbackRecord[]) : [];
  } catch {
    feedbackStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackStore.slice(0, 200)));
};

export const submitFeedback = (
  type: FeedbackType,
  message: string,
  options?: {
    rating?: number;
    conversationId?: string | null;
    disciplineId?: string | null;
  }
): FeedbackRecord => {
  hydrate();
  const record: FeedbackRecord = {
    id: crypto.randomUUID(),
    type,
    message: message.trim(),
    rating: options?.rating,
    conversationId: options?.conversationId ?? null,
    disciplineId: options?.disciplineId ?? null,
    timestamp: Date.now(),
  };
  feedbackStore.unshift(record);
  persist();
  return record;
};

export const listFeedback = (): FeedbackRecord[] => {
  hydrate();
  return [...feedbackStore];
};

export const getAverageRating = (): number => {
  hydrate();
  const ratings = feedbackStore
    .filter((f) => f.type === "rating" && f.rating !== undefined)
    .map((f) => f.rating!);
  if (ratings.length === 0) return 0;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
};

export const handleFeedbackMessage = (
  message: string,
  conversationId: string,
  disciplineId: string | null
): FeedbackRecord | null => {
  const normalized = message.trim();

  const ratingMatch = normalized.match(
    /^(?:rate|rating)\s+(?:response\s+)?(\d)(?:\s*\/\s*5)?/i
  );
  if (ratingMatch) {
    const rating = Math.min(5, Math.max(1, Number(ratingMatch[1])));
    return submitFeedback("rating", `User rated response ${rating}/5`, {
      rating,
      conversationId,
      disciplineId,
    });
  }

  const incorrectMatch = normalized.match(
    /^(?:report\s+incorrect|incorrect\s+information|wrong\s+answer)\s*[:\-]?\s*(.*)$/i
  );
  if (incorrectMatch) {
    return submitFeedback(
      "incorrect-information",
      incorrectMatch[1] || "Incorrect information reported",
      { conversationId, disciplineId }
    );
  }

  const suggestMatch = normalized.match(
    /^(?:suggest\s+improvement|improvement\s+suggestion)\s*[:\-]?\s*(.*)$/i
  );
  if (suggestMatch) {
    return submitFeedback(
      "suggestion",
      suggestMatch[1] || "Improvement suggested",
      { conversationId, disciplineId }
    );
  }

  const engineeringMatch = normalized.match(
    /^(?:engineering\s+feedback|technical\s+feedback)\s*[:\-]?\s*(.*)$/i
  );
  if (engineeringMatch) {
    return submitFeedback(
      "engineering-feedback",
      engineeringMatch[1] || "Engineering feedback provided",
      { conversationId, disciplineId }
    );
  }

  const featureMatch = normalized.match(
    /^(?:request\s+feature|new\s+feature|feature\s+request)\s*[:\-]?\s*(.*)$/i
  );
  if (featureMatch) {
    return submitFeedback(
      "feature-request",
      featureMatch[1] || "Feature requested",
      { conversationId, disciplineId }
    );
  }

  return null;
};

export const getFeatureRequests = (): FeedbackRecord[] => {
  hydrate();
  return feedbackStore.filter((f) => f.type === "feature-request");
};
