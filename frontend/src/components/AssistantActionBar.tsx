import React, { useMemo, useState } from "react";
import {
  ACTION_BAR_ITEMS,
  buildActionContext,
  dispatchEngineeringAction,
  getDisciplineActions,
  triggerDownload,
  type ActionBarActionId,
  type EngineeringActionResult,
  type EngineeringDeliverableType,
} from "../actions";
import { getEngineeringSession } from "../context";
import { useSarathiWorkspace } from "../sarathi/context/SarathiWorkspaceContext";
import type { ChatMessage } from "../types/chatMessage";

interface AssistantActionBarProps {
  message: ChatMessage;
  conversationId: string;
  onActionResult?: (result: EngineeringActionResult) => void;
}

const AssistantActionBar: React.FC<AssistantActionBarProps> = ({
  message,
  conversationId,
  onActionResult,
}) => {
  const [status, setStatus] = useState<string | null>(null);
  const [showGenerateMenu, setShowGenerateMenu] = useState(false);
  const { activeDiscipline, activeModuleId } = useSarathiWorkspace();

  const disciplineActions = useMemo(
    () =>
      getDisciplineActions(
        message.metadata?.disciplineId ?? activeDiscipline?.id ?? null,
        message.metadata?.disciplineName ?? activeDiscipline?.name ?? null
      ),
    [activeDiscipline, message.metadata]
  );

  const actionContext = useMemo(() => {
    const session = getEngineeringSession();
    return buildActionContext({
      messageId: message.id,
      content: message.content,
      conversationId,
      disciplineId:
        message.metadata?.disciplineId ?? activeDiscipline?.id ?? null,
      disciplineName:
        message.metadata?.disciplineName ?? activeDiscipline?.name ?? null,
      moduleId: message.metadata?.moduleId ?? activeModuleId,
      sessionTopic:
        message.metadata?.sessionTopic ?? session.currentTopic ?? null,
      metadata: message.metadata,
    });
  }, [message, conversationId, activeDiscipline, activeModuleId]);

  const runAction = async (
    actionId: ActionBarActionId,
    deliverableType?: EngineeringDeliverableType
  ) => {
    setShowGenerateMenu(false);
    const result = await dispatchEngineeringAction(
      actionId,
      actionContext,
      deliverableType
    );

    if (result.download) {
      triggerDownload(result.download.blob, result.download.filename);
    }

    setStatus(result.message);
    setTimeout(() => setStatus(null), 3000);
    onActionResult?.(result);
  };

  return (
    <div className="mt-2 px-1">
      <div className="flex flex-wrap items-center gap-1">
        {ACTION_BAR_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => void runAction(item.id)}
            className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-400 transition hover:border-cyan-500/30 hover:bg-slate-800 hover:text-cyan-300"
            title={item.label}
          >
            {item.shortLabel ?? item.label}
          </button>
        ))}

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowGenerateMenu((open) => !open)}
            className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-300 transition hover:bg-cyan-500/20"
            title="Generate engineering deliverable"
          >
            Generate ▾
          </button>

          {showGenerateMenu ? (
            <div className="absolute bottom-full left-0 z-20 mb-1 max-h-48 w-52 overflow-y-auto rounded-lg border border-white/10 bg-slate-900 py-1 shadow-xl">
              {disciplineActions.map((action) => (
                <button
                  key={action.deliverableType}
                  type="button"
                  onClick={() =>
                    void runAction("generate-deliverable", action.deliverableType)
                  }
                  className="block w-full px-3 py-1.5 text-left text-[11px] text-slate-300 hover:bg-slate-800 hover:text-cyan-300"
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {status ? (
        <p className="mt-1 text-[10px] text-slate-500">{status}</p>
      ) : null}
    </div>
  );
};

export default AssistantActionBar;
