import type { DashboardNotification, NotificationType } from "./types";

const NOTIFICATIONS_KEY = "sarathi.dashboard.notifications";

const SEED_NOTIFICATIONS: Omit<DashboardNotification, "read">[] = [
  {
    id: "notif-standards-1",
    type: "standards-update",
    title: "IS 456:2000 Amendment Available",
    message: "Review updated provisions for high-strength concrete design.",
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: "notif-news-1",
    type: "engineering-news",
    title: "BIM Mandate Expanding in Public Projects",
    message: "Government infrastructure projects increasingly require BIM Level 2 compliance.",
    timestamp: Date.now() - 86400000 * 3,
  },
  {
    id: "notif-event-1",
    type: "event",
    title: "Indian Engineering Congress 2026",
    message: "Annual conference on sustainable infrastructure — registration open.",
    timestamp: Date.now() - 86400000 * 5,
  },
  {
    id: "notif-webinar-1",
    type: "webinar",
    title: "AI in Structural Design — Free Webinar",
    message: "Learn how AI assists in seismic analysis and optimization.",
    timestamp: Date.now() - 86400000 * 1,
  },
  {
    id: "notif-tender-1",
    type: "tender-alert",
    title: "Highway Package Tender — Western Region",
    message: "NHAI EPC package estimated at ₹450 Cr — pre-bid meeting next week.",
    timestamp: Date.now() - 86400000 * 4,
  },
  {
    id: "notif-job-1",
    type: "job-opportunity",
    title: "Senior Structural Engineer — Metro Project",
    message: "Leading consultancy seeking 8+ years experience in transit structures.",
    timestamp: Date.now() - 86400000 * 6,
  },
  {
    id: "notif-promo-1",
    type: "business-promotion",
    title: "ETAP Training — 20% Early Bird Discount",
    message: "Professional power system analysis certification program.",
    timestamp: Date.now() - 86400000 * 7,
  },
  {
    id: "notif-system-1",
    type: "system",
    title: "Sarathi AI — New Modules Available",
    message: "Site Execution, Knowledge Capture, and Mentor modules are now active.",
    timestamp: Date.now() - 3600000,
  },
];

const loadNotifications = (): DashboardNotification[] => {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (raw) return JSON.parse(raw) as DashboardNotification[];
  } catch {
    // fall through
  }
  const seeded = SEED_NOTIFICATIONS.map((n) => ({ ...n, read: false }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(seeded));
  return seeded;
};

export const getNotifications = (): DashboardNotification[] =>
  loadNotifications().sort((a, b) => b.timestamp - a.timestamp);

export const getUnreadCount = (): number =>
  getNotifications().filter((n) => !n.read).length;

export const markNotificationRead = (id: string): void => {
  const notifications = loadNotifications();
  const updated = notifications.map((n) =>
    n.id === id ? { ...n, read: true } : n
  );
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};

export const formatNotifications = (
  notifications: DashboardNotification[],
  filterType?: NotificationType
): string => {
  const filtered = filterType
    ? notifications.filter((n) => n.type === filterType)
    : notifications;

  const typeLabel: Record<NotificationType, string> = {
    "standards-update": "Standards Updates",
    "engineering-news": "Engineering News",
    event: "Events",
    webinar: "Webinars",
    "tender-alert": "Tender Alerts",
    "job-opportunity": "Job Opportunities",
    "business-promotion": "Business Promotions",
    system: "System Notifications",
  };

  return [
    `NOTIFICATIONS (${filtered.filter((n) => !n.read).length} unread)`,
    "",
    ...filtered.slice(0, 10).map((n) =>
      [
        `${n.read ? "○" : "●"} [${typeLabel[n.type]}] ${n.title}`,
        `   ${n.message}`,
        `   ${new Date(n.timestamp).toLocaleDateString()}`,
      ].join("\n")
    ),
  ].join("\n\n");
};

export const NOTIFICATION_COUNT = SEED_NOTIFICATIONS.length;
