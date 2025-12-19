import { Answers } from './mockEngine';

const STORAGE_KEY = 'specifythat-session';

interface SessionData {
  description: string;
  answers: Answers;
  editedQuestions: number[];
  finalSpec: string;
}

export function saveSession(data: Partial<SessionData>): void {
  if (typeof window === 'undefined') return;
  
  const existing = loadSession();
  const merged = { ...existing, ...data };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function loadSession(): SessionData {
  if (typeof window === 'undefined') {
    return { description: '', answers: {}, editedQuestions: [], finalSpec: '' };
  }
  
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load session:', e);
  }
  
  return { description: '', answers: {}, editedQuestions: [], finalSpec: '' };
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getDescription(): string {
  return loadSession().description;
}

export function setDescription(description: string): void {
  saveSession({ description });
}

export function getAnswers(): Answers {
  return loadSession().answers;
}

export function setAnswers(answers: Answers): void {
  saveSession({ answers });
}

export function getEditedQuestions(): number[] {
  return loadSession().editedQuestions;
}

export function setEditedQuestions(editedQuestions: number[]): void {
  saveSession({ editedQuestions });
}

export function getFinalSpec(): string {
  return loadSession().finalSpec;
}

export function setFinalSpec(finalSpec: string): void {
  saveSession({ finalSpec });
}
