import React, { useEffect, useRef } from "react";
import Message from "./Message";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onClearChat?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onClearChat,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">

        {/* Toolbar */}
        {messages.length > 0 && onClearChat && (
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={onClearChat}
              disabled={isLoading}
              className="px-3 py-2 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Clear Chat
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center min-h-full">
            <div className="text-center">

              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚙️</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Start Chatting with CEIS AI
              </h2>

              <p className="text-slate-400">
                Ask about engineering, design, contracts,
                estimates, project management, highways,
                structures or any technical topic.
              </p>

            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <Message
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}

            {isLoading && (
              <div className="flex gap-4 mb-6">

                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      ⚙️
                    </span>
                  </div>
                </div>

                <div className="max-w-2xl">
                  <div className="rounded-2xl px-4 py-3 bg-slate-800/80 text-slate-100 border border-white/10">

                    <div className="flex gap-2 items-center">

                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-200"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce animation-delay-400"></div>
                      </div>

                      <span className="text-sm text-slate-400">
                        CEIS AI is thinking...
                      </span>

                    </div>

                  </div>
                </div>

              </div>
            )}

            <div ref={messagesEndRef}></div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;