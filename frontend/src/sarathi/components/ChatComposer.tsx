import React from "react";
import ChatInput from "../../components/ChatInput";
import { useDisciplineWorkspaceConfig } from "../../config/disciplines/useDisciplineWorkspaceConfig";

interface ChatComposerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
  onSelectPrompt: (prompt: string) => void;
  recentQuestions: string[];
}

const ChatComposer: React.FC<ChatComposerProps> = ({
  onSendMessage,
  isLoading,
  onStop,
  onSelectPrompt: _onSelectPrompt,
  recentQuestions: _recentQuestions,
}) => {  const disciplineConfig = useDisciplineWorkspaceConfig();

  return (
    <footer className="shrink-0 border-t border-slate-800 bg-slate-950">
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        onStop={onStop}
        placeholder={
          disciplineConfig?.chatPlaceholder ??
          "Ask Sarathi AI about design, standards, calculations, and engineering decisions..."
        }
      />
    </footer>
  );
};
export default ChatComposer;
