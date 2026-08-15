export type SidebarMenuId =
  | "dashboard"
  | "chat"
  | "engineering"
  | "learning"
  | "documents"
  | "tools"
  | "subscription"
  | "wallet"
  | "notifications"
  | "settings"
  | "help"
  | "profile";

export interface SidebarMenuItem {
  id: SidebarMenuId;
  icon: string;
  title: string;
  route: string;
  section: "main" | "account";
}

export const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
  { id: "dashboard", icon: "🏠", title: "Dashboard", route: "/dashboard", section: "main" },
  { id: "chat", icon: "🤖", title: "AI Chat", route: "/chat", section: "main" },
  { id: "engineering", icon: "🏗️", title: "Engineering Hub", route: "/engineering-hub", section: "main" },
  { id: "learning", icon: "🎓", title: "Learning Hub", route: "/learning", section: "main" },
  { id: "documents", icon: "📄", title: "Documents", route: "/documents", section: "main" },
  { id: "tools", icon: "🧮", title: "Engineering Tools", route: "/engineering-tools", section: "main" },
  { id: "subscription", icon: "💳", title: "Subscription", route: "/subscription", section: "account" },
  { id: "wallet", icon: "👛", title: "Wallet", route: "/wallet", section: "account" },
  { id: "notifications", icon: "🔔", title: "Notifications", route: "/notifications", section: "account" },
  { id: "settings", icon: "⚙️", title: "Settings", route: "/settings", section: "account" },
  { id: "help", icon: "❓", title: "Help & Support", route: "/help", section: "account" },
  { id: "profile", icon: "👤", title: "Profile", route: "/profile", section: "account" },
];

export const getMenuIdFromPath = (pathname: string): SidebarMenuId => {
  const normalized = pathname.replace(/\/$/, "") || "/";

  if (normalized.startsWith("/chat")) {
    return "chat";
  }
  if (normalized.startsWith("/dashboard")) {
    return "dashboard";
  }
  if (normalized.startsWith("/knowledge")) {
    return "dashboard";
  }
  if (
    normalized.startsWith("/decision-intelligence") ||
    normalized.startsWith("/standards-intelligence") ||
    normalized.startsWith("/knowledge-graph") ||
    normalized.startsWith("/memory") ||
    normalized.startsWith("/pmis") ||
    normalized.startsWith("/search") ||
    normalized.startsWith("/engineering")
  ) {
    return "dashboard";
  }

  const match = SIDEBAR_MENU_ITEMS.find(
    (item) => normalized === item.route || normalized.startsWith(`${item.route}/`)
  );
  return match?.id ?? "dashboard";
};

export const getRouteForMenu = (menuId: SidebarMenuId): string =>
  SIDEBAR_MENU_ITEMS.find((item) => item.id === menuId)?.route ?? "/dashboard";
