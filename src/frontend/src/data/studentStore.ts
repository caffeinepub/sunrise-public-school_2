import { type SStudent, sampleStudents } from "./sampleData";

const STORAGE_KEY = "schoolStudents";

export function loadStudents(): SStudent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SStudent[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return sampleStudents;
}

export function saveStudents(students: SStudent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch {
    // ignore
  }
}
