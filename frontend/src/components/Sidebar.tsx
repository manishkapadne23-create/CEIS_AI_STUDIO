import React, { useState } from "react";

interface RecentChat {
  id: string;
  title: string;
  date: string;
}

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId?: string;
  recentChats: RecentChat[];
}

const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onMenuChange,
  onNewChat,
  onSelectChat,
  currentChatId,
  recentChats,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      icon: "🏠",
      title: "Dashboard",
    },
    {
      id: "chat",
      icon: "🤖",
      title: "AI Chat",
    },
    {
      id: "engineering",
      icon: "🏗️",
      title: "Engineering Hub",
    },
    {
      id: "learning",
      icon: "🎓",
      title: "Learning Hub",
    },
    {
      id: "documents",
      icon: "📄",
      title: "Documents",
    },
    {
      id: "tools",
      icon: "🧮",
      title: "Engineering Tools",
    },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-72"
      } h-screen bg-slate-900 border-r border-slate-800 text-white flex flex-col transition-all duration-300`}
    >
      {/* Header */}

      <div className="flex items-center justify-between p-5 border-b border-slate-800">

        {!collapsed && (
          <div>

            <h1 className="text-2xl font-bold text-cyan-400">
              CEIS AI
            </h1>

            <p className="text-xs text-slate-400">
              Engineering Intelligence
            </p>

          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 hover:bg-slate-800"
        >
          {collapsed ? "➡️" : "⬅️"}
        </button>

      </div>

      {/* New Chat */}

      <div className="p-4">

        <button
          onClick={onNewChat}
          className="w-full rounded-xl bg-cyan-600 py-3 font-semibold hover:bg-cyan-500"
        >
          {collapsed ? "＋" : "＋ New Chat"}
        </button>

      </div>

      {/* Navigation */}

      <div className="px-3">

        {!collapsed && (
          <p className="mb-3 px-3 text-xs uppercase tracking-widest text-slate-500">
            Navigation
          </p>
        )}

        <div className="space-y-1">

          {menuItems.map((item) => (

            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 transition ${
                activeMenu === item.id
                  ? "bg-cyan-600 text-white"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              <span className="text-xl">
                {item.icon}
              </span>

              {!collapsed && (
                <span>
                  {item.title}
                </span>
              )}

            </button>

          ))}

        </div>

      </div>

      <div className="my-5 border-t border-slate-800" />

      {/* Recent Chats */}

      <div className="flex-1 overflow-y-auto px-3">

        {!collapsed && (
          <p className="mb-3 px-3 text-xs uppercase tracking-widest text-slate-500">
            Recent Chats
          </p>
        )}

        <div className="space-y-2">

          {recentChats.map((chat) => (
          <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full rounded-lg px-3 py-3 text-left transition ${
                currentChatId === chat.id
                  ? "bg-cyan-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {collapsed ? (
                <span className="text-lg">💬</span>
              ) : (
                <>
                  <div className="truncate font-medium">
                    {chat.title}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {chat.date}
                  </div>
                </>
              )}
            </button>
          ))}

        </div>

      </div>

      {/* Bottom Menu */}

      <div className="border-t border-slate-800 p-3 space-y-1">

        <button
          onClick={() => onMenuChange("subscription")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-slate-300 hover:bg-slate-800"
        >
          <span className="text-xl">💳</span>

          {!collapsed && (
            <span>Subscription</span>
          )}
        </button>

        <button
          onClick={() => onMenuChange("notifications")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-slate-300 hover:bg-slate-800"
        >
          <span className="text-xl">🔔</span>

          {!collapsed && (
            <span>Notifications</span>
          )}
        </button>

        <button
          onClick={() => onMenuChange("settings")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-slate-300 hover:bg-slate-800"
        >
          <span className="text-xl">⚙️</span>

          {!collapsed && (
            <span>Settings</span>
          )}
        </button>

        <button
          onClick={() => onMenuChange("help")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-slate-300 hover:bg-slate-800"
        >
          <span className="text-xl">❓</span>

          {!collapsed && (
            <span>Help</span>
          )}
        </button>

      </div>

      {/* Upgrade Card */}

      <div className="px-3 pb-4">

        <div className="rounded-2xl border border-cyan-600/20 bg-cyan-600/10 p-4">

          {!collapsed ? (
            <>
              <h3 className="font-semibold text-cyan-400">
                Upgrade to Pro
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Unlock AI Engineering, Smart Documents,
                BOQ Generator, Drawing Review,
                Estimation Tools and PMIS Integration.
              </p>

              <button
                className="mt-4 w-full rounded-xl bg-cyan-600 py-2 font-semibold hover:bg-cyan-500"
              >
                Upgrade Now
              </button>
            </>
          ) : (
            <div className="text-center text-2xl">
              🚀
            </div>
          )}

        </div>

      </div>

      {/* User Section */}

      <div className="border-t border-slate-800 p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 font-bold">
            U
          </div>

          {!collapsed && (
            <div className="flex-1">

              <div className="font-semibold">
                User
              </div>

              <div className="text-xs text-slate-400">
                Standard Plan
              </div>
</div>
          )}

        </div>

        {!collapsed && (
          <button
            onClick={() => {
              console.log("Logout");
            }}
            className="mt-4 w-full rounded-xl border border-red-500/30 py-2 text-red-400 hover:bg-red-500/10 transition"
          >
            Logout
          </button>
        )}

      </div>

    </aside>
  );
};

export default Sidebar;
