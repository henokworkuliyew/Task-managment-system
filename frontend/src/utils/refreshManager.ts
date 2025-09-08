// Smart refresh manager for social media-like experience
export class RefreshManager {
  private static lastRefreshTimes: Map<string, number> = new Map();
  private static REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

  static shouldRefresh(key: string): boolean {
    const lastRefresh = this.lastRefreshTimes.get(key);
    const now = Date.now();
    
    if (!lastRefresh || (now - lastRefresh) > this.REFRESH_INTERVAL) {
      this.lastRefreshTimes.set(key, now);
      return true;
    }
    
    return false;
  }

  static forceRefresh(key: string): void {
    this.lastRefreshTimes.set(key, Date.now());
  }

  static clearRefreshTime(key: string): void {
    this.lastRefreshTimes.delete(key);
  }
}

// Refresh keys for different data types
export const REFRESH_KEYS = {
  PROJECTS: 'projects',
  TASKS: 'tasks',
  ISSUES: 'issues',
  NOTIFICATIONS: 'notifications',
} as const;
