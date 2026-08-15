import React, { useEffect, useMemo, useRef, useState } from "react";

interface StoredUser {
  name?: string;
  email?: string;
}

const readStoredUser = (): StoredUser => {
  try {
    const raw = localStorage.getItem("user");

    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as StoredUser;
  } catch {
    return {};
  }
};

const getDisplayName = (user: StoredUser): string => {
  if (user.name?.trim()) {
    return user.name.trim();
  }

  if (user.email?.trim()) {
    const [localPart] = user.email.split("@");
    return localPart || "User";
  }

  return "User";
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

interface UserProfileMenuProps {
  onMenuAction?: (action: string) => void;
  className?: string;
}

const MENU_ITEMS = [
  { id: "profile", label: "My Profile" },
  { id: "saved-chats", label: "Saved Chats" },
  { id: "documents", label: "My Documents" },
  { id: "subscription", label: "Subscription" },
  { id: "settings", label: "Settings" },
  { id: "help", label: "Help" },
  { id: "logout", label: "Logout", danger: true },
] as const;

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  onMenuAction,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useMemo(() => readStoredUser(), []);
  const displayName = getDisplayName(user);
  const initials = getInitials(displayName);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleAction = (actionId: string) => {
    setIsOpen(false);

    if (actionId === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    onMenuAction?.(actionId);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-left transition hover:border-slate-600 hover:bg-slate-900 sm:px-3"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-[8rem] truncate text-sm font-medium text-slate-200 sm:block">
          {displayName}
        </span>
        <span
          className={`hidden text-xs text-slate-400 transition sm:inline ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 py-1 shadow-2xl"
        >
          <div className="border-b border-slate-800 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">
              {displayName}
            </p>
            {user.email ? (
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {user.email}
              </p>
            ) : null}
          </div>
          <ul>
            {MENU_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => handleAction(item.id)}
                  className={`flex w-full px-4 py-2.5 text-left text-sm transition hover:bg-slate-900 ${
                    "danger" in item && item.danger
                      ? "text-red-400"
                      : "text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default UserProfileMenu;
