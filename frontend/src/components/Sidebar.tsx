import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductBrand from "./ProductBrand";
import LogoutConfirmDialog from "./LogoutConfirmDialog";
import { useChatSession } from "../navigation/ChatSessionContext";
import {
  SIDEBAR_MENU_ITEMS,
  type SidebarMenuId,
} from "../navigation/sidebarRoutes";
import { useSidebarNavigation } from "../navigation/useSidebarNavigation";
import { useSarathiWorkspace } from "../sarathi/context/SarathiWorkspaceContext";

type FocusableItem =
  | { type: "menu"; id: SidebarMenuId }
  | { type: "chat"; id: string }
  | { type: "new-chat" }
  | { type: "logout" }
  | { type: "collapse" };

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { isAppNavCollapsed, toggleAppNavCollapsed } = useSarathiWorkspace();
  const { activeMenu, navigateToMenu } = useSidebarNavigation();
  const { recentChats, currentChatId, startNewChat, selectChat } = useChatSession();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const asideRef = useRef<HTMLElement>(null);

  const mainItems = useMemo(
    () => SIDEBAR_MENU_ITEMS.filter((item) => item.section === "main"),
    []
  );
  const accountItems = useMemo(
    () => SIDEBAR_MENU_ITEMS.filter((item) => item.section === "account"),
    []
  );

  const focusableItems = useMemo<FocusableItem[]>(
    () => [
      { type: "new-chat" },
      ...mainItems.map((item) => ({ type: "menu" as const, id: item.id })),
      ...recentChats.map((chat) => ({ type: "chat" as const, id: chat.id })),
      ...accountItems.map((item) => ({ type: "menu" as const, id: item.id })),
      { type: "logout" },
      { type: "collapse" },
    ],
    [mainItems, accountItems, recentChats]
  );

  const activateItem = useCallback(
    (item: FocusableItem) => {
      if (item.type === "menu") {
        navigateToMenu(item.id);
        return;
      }
      if (item.type === "chat") {
        selectChat(item.id);
        return;
      }
      if (item.type === "new-chat") {
        startNewChat();
        return;
      }
      if (item.type === "logout") {
        setShowLogoutDialog(true);
        return;
      }
      if (item.type === "collapse") {
        toggleAppNavCollapsed();
      }
    },
    [navigateToMenu, selectChat, startNewChat, toggleAppNavCollapsed]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogoutDialog(false);
    navigate("/");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!asideRef.current?.contains(document.activeElement) && event.target !== document.body) {
        return;
      }

      if (event.altKey && event.key >= "1" && event.key <= "6") {
        const index = Number(event.key) - 1;
        const item = mainItems[index];
        if (item) {
          event.preventDefault();
          navigateToMenu(item.id);
        }
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, focusableItems.length - 1));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (event.key === "Enter") {
        const item = focusableItems[focusedIndex];
        if (item) {
          event.preventDefault();
          activateItem(item);
        }
        return;
      }

      if (event.key === "Escape") {
        setShowLogoutDialog(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activateItem, focusableItems, focusedIndex, mainItems, navigateToMenu]);

  const menuButtonClass = (isActive: boolean, isCollapsed: boolean) =>
    `flex w-full items-center rounded-xl transition ${
      isCollapsed ? "justify-center px-0 py-3" : "gap-3 px-3 py-3"
    } ${
      isActive
        ? "bg-cyan-600 text-white"
        : "text-slate-300 hover:bg-slate-800"
    }`;

  return (
    <>
      <aside
        ref={asideRef}
        className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-r border-slate-800 bg-slate-900 text-white transition-all duration-[250ms] ease-in-out"
        aria-label="Main navigation"
      >
        <div className="shrink-0 border-b border-slate-800 p-4">
          <ProductBrand size={isAppNavCollapsed ? "sm" : "lg"} />
          <button
            type="button"
            onClick={toggleAppNavCollapsed}
            aria-label={isAppNavCollapsed ? "Expand navigation menu" : "Collapse navigation menu"}
            title={isAppNavCollapsed ? "Expand navigation menu" : "Collapse navigation menu"}
            className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-lg text-slate-300 transition hover:bg-slate-800"
          >
            ☰
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className={isAppNavCollapsed ? "px-2 py-3" : "p-4"}>
            <button
              type="button"
              onClick={startNewChat}
              title="New Chat"
              className={`w-full rounded-xl bg-cyan-600 font-semibold transition hover:bg-cyan-500 ${
                isAppNavCollapsed ? "px-0 py-3 text-xl" : "py-3"
              }`}
            >
              {isAppNavCollapsed ? "＋" : "＋ New Chat"}
            </button>
          </div>

          <div className={isAppNavCollapsed ? "px-2" : "px-3"}>
            {!isAppNavCollapsed ? (
              <p className="mb-3 px-3 text-xs uppercase tracking-widest text-slate-500">
                Navigation
              </p>
            ) : null}
            <div className="space-y-1" role="menu">
              {mainItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  title={item.title}
                  onClick={() => navigateToMenu(item.id)}
                  className={menuButtonClass(activeMenu === item.id, isAppNavCollapsed)}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isAppNavCollapsed ? <span>{item.title}</span> : null}
                </button>
              ))}
            </div>
          </div>

          <div className="my-4 border-t border-slate-800" />

          <div
            className={`min-h-0 flex-1 overflow-y-auto ${
              isAppNavCollapsed ? "px-2" : "px-3"
            }`}
          >
            {!isAppNavCollapsed ? (
              <p className="mb-3 px-3 text-xs uppercase tracking-widest text-slate-500">
                Recent Chats
              </p>
            ) : null}
            <div className="space-y-2">
              {recentChats.map((chat) => (
                <button
                  key={chat.id}
                  type="button"
                  title={chat.title}
                  onClick={() => selectChat(chat.id)}
                  className={`w-full rounded-lg transition ${
                    isAppNavCollapsed
                      ? "px-0 py-3 text-center"
                      : "px-3 py-3 text-left"
                  } ${
                    currentChatId === chat.id && activeMenu === "chat"
                      ? "bg-cyan-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {isAppNavCollapsed ? (
                    <span className="text-lg">💬</span>
                  ) : (
                    <>
                      <div className="truncate font-medium">{chat.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{chat.date}</div>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div
            className={`space-y-1 border-t border-slate-800 ${
              isAppNavCollapsed ? "p-2" : "p-3"
            }`}
          >
            {accountItems.map((item) => (
              <button
                key={item.id}
                type="button"
                title={item.title}
                onClick={() => navigateToMenu(item.id)}
                className={menuButtonClass(activeMenu === item.id, isAppNavCollapsed)}
              >
                <span className="text-xl">{item.icon}</span>
                {!isAppNavCollapsed ? <span>{item.title}</span> : null}
              </button>
            ))}
            <button
              type="button"
              title="Logout"
              onClick={() => setShowLogoutDialog(true)}
              className={`flex w-full items-center rounded-xl text-red-400 transition hover:bg-slate-800 ${
                isAppNavCollapsed
                  ? "justify-center px-0 py-3"
                  : "gap-3 px-3 py-3"
              }`}
            >
              <span className="text-xl">🚪</span>
              {!isAppNavCollapsed ? <span>Logout</span> : null}
            </button>
          </div>

          <div className={isAppNavCollapsed ? "px-2 pb-3" : "px-3 pb-4"}>
            <div
              className={`rounded-2xl border border-cyan-600/20 bg-cyan-600/10 ${
                isAppNavCollapsed ? "p-2" : "p-4"
              }`}
            >
              {!isAppNavCollapsed ? (
                <>
                  <h3 className="font-semibold text-cyan-400">Upgrade to Pro</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Unlock AI Engineering, Smart Documents, BOQ Generator, Drawing
                    Review, Estimation Tools and PMIS Integration.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigateToMenu("subscription")}
                    className="mt-4 w-full rounded-xl bg-cyan-600 py-2 font-semibold hover:bg-cyan-500"
                  >
                    Upgrade Now
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  title="Upgrade to Pro"
                  onClick={() => navigateToMenu("subscription")}
                  className="w-full text-center text-2xl"
                >
                  🚀
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      <LogoutConfirmDialog
        open={showLogoutDialog}
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Sidebar;
