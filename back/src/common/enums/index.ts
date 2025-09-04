export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  BLOCKED = "blocked",
  REVIEW = "review",
  DONE = "done",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum IssueStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}

export enum IssueSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  CONTRIBUTOR = "contributor",
  VIEWER = "viewer",
}

export enum NotificationType {
  TASK_ASSIGNED = "task_assigned",
  TASK_UPDATED = "task_updated",
  COMMENT_ADDED = "comment_added",
  DEADLINE_REMINDER = "deadline_reminder",
  MENTION = "mention",
}
