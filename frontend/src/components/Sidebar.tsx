import React, { useState } from 'react';

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId?: string;
  recentChats: Array<{ id: string; title: string; date: string }>;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, onSelectChat, currentChatId, recentChats }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">⚙</span>
              </div>
              <span className="font-bold text-white">CEIS AI</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {isCollapsed ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            )}
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300 hover:text-cyan-200 font-semibold transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V9.5M10.5 1.5v4m0-4h4m-4 4h4M3.5 10.5h13" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {!isCollapsed && 'New Chat'}
          </button>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {!isCollapsed && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-3 mb-2">
              Recent chats
            </p>
          )}

          <div className="space-y-2">
            {recentChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 truncate ${
                  currentChatId === chat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
                }`}
                title={chat.title}
              >
                {isCollapsed ? (
                  <span className="text-lg">💬</span>
                ) : (
                  <>
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{chat.date}</p>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 space-y-2">
          <button className="w-full p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-300 transition-colors text-sm text-left">
            {isCollapsed ? '⚙' : 'Settings'}
          </button>
          <button className="w-full p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-300 transition-colors text-sm text-left">
            {isCollapsed ? '?' : 'Help & Feedback'}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">⚙</span>
          </div>
          <span className="font-bold text-white">CEIS AI</span>
        </div>
        <button
          onClick={onNewChat}
          className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V9.5M10.5 1.5v4m0-4h4m-4 4h4M3.5 10.5h13" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Sidebar;
