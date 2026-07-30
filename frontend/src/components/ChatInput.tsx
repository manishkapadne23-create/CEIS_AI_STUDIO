import React, { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStop,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height =
      Math.min(textarea.scrollHeight, 120) + "px";
  }, [message]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    // Prevent empty messages and duplicate submission
    // while the AI is already responding.
    if (!trimmedMessage || isLoading) return;

    onSendMessage(trimmedMessage);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (!isLoading) {
        handleSend();
      }
    }
  };

  return (
    <div className="border-t border-white/10 bg-slate-950/80 backdrop-blur-xl p-4">
      <div className="max-w-4xl mx-auto">

        <div className="flex gap-3 mb-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Ask CEIS AI about engineering, design, contracts, estimates..."
            className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 resize-none focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
            rows={1}
          />

          <div className="flex flex-col gap-2">

            {isLoading && onStop ? (
              <button
                type="button"
                onClick={onStop}
                className="p-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all"
                title="Stop response"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <rect
                    x="5"
                    y="5"
                    width="10"
                    height="10"
                    rx="1"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={
                  isLoading || !message.trim()
                }
                className="p-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                title="Send message"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                </svg>
              </button>
            )}

          </div>
        </div>

        <div className="flex gap-2 flex-wrap text-sm">

          <button
            type="button"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-300 transition-colors"
            title="Voice input - coming soon"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zM5.5 9a.5.5 0 01.5.5v1a5 5 0 0010 0v-1a.5.5 0 011 0v1a6 6 0 01-11 0v-1a.5.5 0 01.5-.5z" />
            </svg>
          </button>

          <button
            type="button"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-300 transition-colors"
            title="Upload file - coming soon"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            </svg>
          </button>

          <span className="text-xs text-slate-500 flex items-center">
            Enter to send • Shift + Enter for new line
          </span>

        </div>
      </div>
    </div>
  );
};

export default ChatInput;