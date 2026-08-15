import React, { useMemo } from "react";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";
import ChatCenterPanel from "./ChatCenterPanel";
import CompactModuleNav from "./CompactModuleNav";
import StandardViewer from "./StandardViewer";
import type { EngineeringActionResult } from "../../actions";
import type { ChatMessage } from "../../types/chatMessage";

interface SarathiChatColumnProps {
  messages: ChatMessage[];
  isLoading: boolean;
  conversationId?: string;
  onSendMessage: (message: string) => void;
  onStop: () => void;
  onClearChat: () => void;
  onSelectPrompt: (prompt: string) => void;
  onActionResult?: (result: EngineeringActionResult) => void;
  className?: string;
  style?: React.CSSProperties;
}

const SarathiChatColumn: React.FC<SarathiChatColumnProps> = ({
  messages,
  isLoading,
  conversationId,
  onSendMessage,
  onStop,
  onClearChat,
  onSelectPrompt,
  onActionResult,
  className = "",
  style,
}) => {
  const { selectedStandard, closeStandard } = useSarathiWorkspace();

  const recentQuestions = useMemo(
    () =>
      messages
        .filter((message) => message.role === "user")
        .slice(-5)
        .reverse()
        .map((message) => message.content),
    [messages]
  );

  return (
    <div
      className={`flex min-h-0 min-w-0 flex-col overflow-hidden bg-slate-950 ${className}`}
      style={style}
    >
      <ChatCenterPanel
        className="min-h-0 flex-1"
        messages={messages}
        isLoading={isLoading}
        conversationId={conversationId}
        onSendMessage={onSendMessage}
        onStop={onStop}
        onClearChat={onClearChat}
        onSelectPrompt={onSelectPrompt}
        onActionResult={onActionResult}
        recentQuestions={recentQuestions}
        header={<CompactModuleNav />}
      />

      {selectedStandard ? (
        <StandardViewer standard={selectedStandard} onClose={closeStandard} />
      ) : null}
    </div>
  );
};

export default SarathiChatColumn;
