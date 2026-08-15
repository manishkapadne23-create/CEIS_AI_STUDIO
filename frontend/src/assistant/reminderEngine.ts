import { getPendingTasks } from "./taskManager";
import type { EngineeringTask, ReminderSummary } from "./types";

const toDateKey = (date: Date): string =>
  date.toISOString().slice(0, 10);

const parseDueDate = (dueDate: string | null): Date | null => {
  if (!dueDate) return null;
  const parsed = new Date(dueDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isSameDay = (a: Date, b: Date): boolean =>
  toDateKey(a) === toDateKey(b);

const isWithinWeek = (date: Date, from: Date): boolean => {
  const weekEnd = new Date(from);
  weekEnd.setDate(weekEnd.getDate() + 7);
  return date >= from && date <= weekEnd;
};

export const buildReminderSummary = (): ReminderSummary => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const pending = getPendingTasks();

  const today: EngineeringTask[] = [];
  const tomorrowTasks: EngineeringTask[] = [];
  const thisWeek: EngineeringTask[] = [];
  const overdue: EngineeringTask[] = [];
  const upcoming: EngineeringTask[] = [];

  for (const task of pending) {
    const due = parseDueDate(task.dueDate);

    if (!due) {
      upcoming.push(task);
      continue;
    }

    if (due < now && !isSameDay(due, now)) {
      overdue.push(task);
    } else if (isSameDay(due, now)) {
      today.push(task);
    } else if (isSameDay(due, tomorrow)) {
      tomorrowTasks.push(task);
    } else if (isWithinWeek(due, now)) {
      thisWeek.push(task);
    } else if (due > now) {
      upcoming.push(task);
    }
  }

  const sortByPriority = (items: EngineeringTask[]) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return items.sort((a, b) => order[a.priority] - order[b.priority]);
  };

  return {
    today: sortByPriority(today),
    tomorrow: sortByPriority(tomorrowTasks),
    thisWeek: sortByPriority(thisWeek),
    overdue: sortByPriority(overdue),
    upcoming: sortByPriority(upcoming).slice(0, 8),
  };
};

export const formatRemindersForPrompt = (summary: ReminderSummary): string => {
  const formatTasks = (label: string, tasks: EngineeringTask[]) => {
    if (tasks.length === 0) return `${label}: none`;
    return `${label}:\n${tasks
      .slice(0, 5)
      .map(
        (t) =>
          `  - [${t.priority}] ${t.name}${t.dueDate ? ` (due ${t.dueDate})` : ""}`
      )
      .join("\n")}`;
  };

  return [
    formatTasks("Today", summary.today),
    formatTasks("Tomorrow", summary.tomorrow),
    formatTasks("This Week", summary.thisWeek),
    formatTasks("Overdue", summary.overdue),
    formatTasks("Upcoming", summary.upcoming),
  ].join("\n\n");
};

export const isReminderQuery = (message: string): boolean =>
  /\b(today'?s?\s+tasks?|tomorrow|this\s+week|overdue|upcoming|due\s+date|reminder|deadline)\b/i.test(
    message
  );
