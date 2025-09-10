// Safe localStorage utilities for state persistence
export const getStoredState = (key: string) => {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    const parsed = item ? JSON.parse(item) : null;
    return parsed;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
};

export const setStoredState = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
};

export const removeStoredState = (key: string) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
};

// Specific state keys
export const STORAGE_KEYS = {
  PROJECTS: 'task_management_projects',
  TASKS: 'task_management_tasks',
  ISSUES: 'task_management_issues',
  AUTH: 'task_management_auth',
} as const;
