import React from "react";
import ChatWindow from "../../components/ChatWindow";
import { useDisciplineWorkspaceConfig } from "../../config/disciplines/useDisciplineWorkspaceConfig";
import ModuleLibraryDock from "../../modules/components/ModuleLibraryDock";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";
import ActiveEngineeringContextBanner from "./ActiveEngineeringContextBanner";
import ChatComposer from "./ChatComposer";
import type { EngineeringActionResult } from "../../actions";
import type { ChatMessage } from "../../types/chatMessage";

interface ChatCenterPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  conversationId?: string;
  onSendMessage: (message: string) => void;
  onStop: () => void;
  onClearChat: () => void;
  onSelectPrompt: (prompt: string) => void;
  onActionResult?: (result: EngineeringActionResult) => void;
  recentQuestions: string[];
  header: React.ReactNode;
  className?: string;
}

const ChatCenterPanel: React.FC<ChatCenterPanelProps> = ({
  messages,
  isLoading,
  conversationId,
  onSendMessage,
  onStop,
  onClearChat,
  onSelectPrompt,
  onActionResult,
  recentQuestions,
  header,
  className = "",
}) => {
  const { activeModuleId } = useSarathiWorkspace();
  const disciplineConfig = useDisciplineWorkspaceConfig();

  const showLibrary =
    Boolean(activeModuleId) &&
    activeModuleId !== "ai-expert" &&
    Boolean(disciplineConfig);

  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden bg-slate-950 ${className}`}
    >
      <header className="shrink-0">
        {header}
        <ActiveEngineeringContextBanner />
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          conversationId={conversationId}
          onClearChat={onClearChat}
          onActionResult={onActionResult}
        />
        {showLibrary && activeModuleId && disciplineConfig ? (
          <ModuleLibraryDock
            moduleId={activeModuleId}
            disciplineConfig={disciplineConfig}
          />
        ) : null}
        <ChatComposer
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          onStop={onStop}
          onSelectPrompt={onSelectPrompt}
          recentQuestions={recentQuestions}
        />
      </div>
    </div>
  );
};

export default ChatCenterPanel;
