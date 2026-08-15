import React, { useState } from "react";

import HubPageContent from "../../components/HubPageContent";
import AppShell from "../../layout/AppShell";

const INITIAL_NOTIFICATIONS = [
  { id: "1", title: "New standards update available", unread: true, category: "system" },
  { id: "2", title: "Your estimation report is ready", unread: true, category: "reports" },
  { id: "3", title: "Webinar: Structural design best practices", unread: false, category: "events" },
];

const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const visible =
    filter === "unread"
      ? notifications.filter((item) => item.unread)
      : notifications;

  return (
    <AppShell>
      <HubPageContent
        title="Notification Center"
        description="Platform alerts, report updates, and engineering event notifications."
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-cyan-600/20 px-3 py-1 text-sm text-cyan-300">
            {unreadCount} unread
          </span>
          <button
            type="button"
            onClick={() =>
              setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })))
            }
            className="rounded-xl border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
          >
            Mark All Read
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`rounded-xl px-3 py-1.5 text-sm ${
              filter === "all" ? "bg-cyan-600 text-white" : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("unread")}
            className={`rounded-xl px-3 py-1.5 text-sm ${
              filter === "unread" ? "bg-cyan-600 text-white" : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Unread
          </button>
        </div>
        <div className="space-y-3">
          {visible.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 ${
                item.unread
                  ? "border-cyan-600/30 bg-cyan-600/10"
                  : "border-slate-800 bg-slate-900/80"
              }`}
            >
              <p className="font-medium text-white">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                {item.category}
              </p>
            </div>
          ))}
        </div>
      </HubPageContent>
    </AppShell>
  );
};

export default NotificationsPage;
