import React from "react";
import SarathiChatColumn from "./SarathiChatColumn";
import type { EngineeringActionResult } from "../../actions";
import type { ChatMessage } from "../../types/chatMessage";

interface SarathiAIWorkspaceProps {
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

/** Backward-compatible alias — chat column only; use ChatPageShell for full grid. */
const SarathiAIWorkspace: React.FC<SarathiAIWorkspaceProps> = (props) => (
  <SarathiChatColumn {...props} />
);

export default SarathiAIWorkspace;
