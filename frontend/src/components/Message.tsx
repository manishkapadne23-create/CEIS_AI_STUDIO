import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AssistantActionBar from "./AssistantActionBar";
import type { ChatMessage } from "../types/chatMessage";
import type { EngineeringActionResult } from "../actions";

interface MessageProps {
  message: ChatMessage;
  conversationId?: string;
  onActionResult?: (result: EngineeringActionResult) => void;
}

const Message: React.FC<MessageProps> = ({
  message,
  conversationId,
  onActionResult,
}) => {
  const { role, content } = message;
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-4 mb-6 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/80 to-blue-600/80">
            <span className="text-[10px] font-bold text-white">S</span>
          </div>
        </div>
      )}

      <div
        className={`max-w-3xl ${
          isUser ? "order-2" : "order-1"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
              : "bg-slate-800/80 text-slate-100 border border-white/10"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          ) : (
            <div className="prose prose-invert max-w-none prose-headings:text-cyan-300 prose-p:text-slate-200 prose-strong:text-white prose-code:text-cyan-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-li:text-slate-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {!isUser && conversationId ? (
          <AssistantActionBar
            message={message}
            conversationId={conversationId}
            onActionResult={onActionResult}
          />
        ) : null}
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">U</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
