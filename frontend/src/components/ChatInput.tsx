import React, { useEffect, useRef, useState } from "react";

import { FOCUS_CHAT_INPUT_EVENT } from "../navigation/events";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  placeholder?: string;
}

const attachmentButtonClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-base text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40";

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStop,
  placeholder = "Ask Sarathi AI about design, standards, calculations, and engineering decisions...",
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleFocusRequest = () => {
      textareaRef.current?.focus();
    };

    window.addEventListener(FOCUS_CHAT_INPUT_EVENT, handleFocusRequest);
    return () => window.removeEventListener(FOCUS_CHAT_INPUT_EVENT, handleFocusRequest);
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [message]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    onSendMessage(trimmedMessage);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!isLoading) {
        handleSend();
      }
    }
  };

  return (
    <div className="bg-slate-950 px-3 py-2 sm:px-4 sm:py-3">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-slate-800/50 px-2 py-2 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30">
          <div className="flex shrink-0 items-center gap-0.5 pb-1">
            <button
              type="button"
              disabled
              className={attachmentButtonClass}
              title="Attach PDF — coming soon"
              aria-label="Attach PDF"
            >
              📄
            </button>
            <button
              type="button"
              disabled
              className={attachmentButtonClass}
              title="Attach drawing — coming soon"
              aria-label="Attach drawing"
            >
              📐
            </button>
            <button
              type="button"
              disabled
              className={attachmentButtonClass}
              title="Voice input — coming soon"
              aria-label="Voice input"
            >
              🎤
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="max-h-40 min-h-[2.5rem] flex-1 resize-none bg-transparent px-1 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            rows={1}
          />

          {isLoading && onStop ? (
            <button
              type="button"
              onClick={onStop}
              className="mb-0.5 shrink-0 rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
              title="Stop response"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="5" y="5" width="10" height="10" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className="mb-0.5 shrink-0 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 p-2 text-white transition hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700"
              title="Send message"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
