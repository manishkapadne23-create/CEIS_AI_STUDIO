import type { CreateNoteInput, EngineeringNote, NoteCategory } from "./types";

const STORAGE_KEY = "sarathi.assistant.notes";

let noteStore: EngineeringNote[] = [];
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    noteStore = raw ? (JSON.parse(raw) as EngineeringNote[]) : [];
  } catch {
    noteStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(noteStore.slice(0, 200)));
};

const inferNoteCategory = (text: string): NoteCategory => {
  const normalized = text.toLowerCase();
  if (/meeting|minutes|mom\b/i.test(normalized)) return "meeting-note";
  if (/idea|concept/i.test(normalized)) return "idea";
  if (/observ|site\s+visit/i.test(normalized)) return "observation";
  if (/calculat|formula/i.test(normalized)) return "calculation";
  if (/reference|standard|irc|is\s+\d/i.test(normalized)) return "reference";
  return "engineering-note";
};

export const createNote = (input: CreateNoteInput): EngineeringNote => {
  hydrate();
  const now = Date.now();
  const note: EngineeringNote = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    content: input.content.trim(),
    category: input.category ?? inferNoteCategory(`${input.title} ${input.content}`),
    disciplineId: input.disciplineId ?? null,
    disciplineName: input.disciplineName ?? null,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
  noteStore.unshift(note);
  persist();
  return note;
};

export const listNotes = (): EngineeringNote[] => {
  hydrate();
  return [...noteStore].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
};

export const deleteNote = (noteId: string): boolean => {
  hydrate();
  const before = noteStore.length;
  noteStore = noteStore.filter((n) => n.id !== noteId);
  if (noteStore.length !== before) {
    persist();
    return true;
  }
  return false;
};

export const parseNoteCommand = (
  message: string
): { action: string; payload: string } | null => {
  const createMatch = message.match(
    /^(?:create|add|new)\s+note\s*[:\-]?\s*(.+)$/i
  );
  if (createMatch) return { action: "create", payload: createMatch[1].trim() };

  const listMatch = message.match(/^(?:list|show|my)\s+notes?$/i);
  if (listMatch) return { action: "list", payload: "" };

  return null;
};
