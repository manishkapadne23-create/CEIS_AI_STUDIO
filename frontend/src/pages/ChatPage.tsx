import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { processEngineeringExpertMessage } from "../ai/engineeringExpertEngine";
import { getSuggestedDeliverables, type EngineeringActionResult } from "../actions";
import {
  registerOrchestratorModuleRouter,
  runOrchestratorWithModuleRouting,
} from "../orchestrator";
import { getEngineeringSession } from "../context";
import { getActiveProject } from "../projects";
import { getAppShellGridColumns } from "../layout/appShellLayout";
import type { ChatMessage } from "../types/chatMessage";
import { useEngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import EngineeringModulePanel from "../sarathi/components/EngineeringModulePanel";
import EngineeringNavigator from "../sarathi/components/EngineeringNavigator";
import ModulePreviewSheet from "../sarathi/components/ModulePreviewSheet";
import SarathiChatColumn from "../sarathi/components/SarathiChatColumn";
import WorkspaceGlobalHeader from "../sarathi/components/WorkspaceGlobalHeader";
import { useMediaQuery } from "../sarathi/hooks/useMediaQuery";
import { getDisciplineDefinitionByName, getNavigatorSpecializations } from "../sarathi/utils/navigatorTree";
import type { EngineeringSearchResult } from "../sarathi/types";
import { resolveStandardsWithKnowledge } from "../knowledge/utils/resolveStandardsWithKnowledge";
import { useChatSession } from "../navigation/ChatSessionContext";
import {
  buildChatPath,
  disciplineIdToSlug,
} from "../navigation/disciplineSlugs";
import { useChatRouteSync } from "../navigation/useChatRouteSync";
import { useWorkspaceNavigation } from "../navigation/WorkspaceNavigationContext";
import { useSarathiWorkspace } from "../sarathi";
import { useChatEngineeringContext } from "../sarathi/hooks/useChatEngineeringContext";

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useChatRouteSync();
  useChatEngineeringContext();
  const { updateWorkspace } = useWorkspaceNavigation();
  const {
    chats,
    currentChatId,
    setChats,
  } = useChatSession();
  const [isLoading, setIsLoading] = useState(false);

  const { workspace } = useEngineeringWorkspace();
  const {
    isAppNavCollapsed,
    selectDiscipline,
    selectSpecialization,
    openStandard,
    activeDiscipline,
    activeSpecialization,
    activeModuleId,
    isModulePanelCollapsed,
    selectedStandardKnowledge,
    moduleSearchQuery,
    openModule,
  } = useSarathiWorkspace();
  const { setSpecialization } = useEngineeringWorkspace();
  const isDesktopShell = useMediaQuery("(min-width: 1024px)");

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!location.pathname.startsWith("/chat")) {
      return;
    }

    const pathParts = location.pathname.split("/").filter(Boolean);
    const urlDisciplineSlug = pathParts[1];

    // Let useChatRouteSync apply discipline from the URL before rewriting it.
    if (!activeDiscipline && urlDisciplineSlug) {
      return;
    }

    const expectedPath = buildChatPath(
      activeDiscipline ? disciplineIdToSlug(activeDiscipline.id) : null,
      activeModuleId
    );

    if (location.pathname !== expectedPath) {
      navigate(expectedPath, { replace: true });
    }
  }, [activeDiscipline, activeModuleId, location.pathname, navigate]);

  useEffect(() => {
    updateWorkspace({
      disciplineId: activeDiscipline?.id ?? null,
      disciplineSlug: activeDiscipline
        ? disciplineIdToSlug(activeDiscipline.id)
        : null,
      specializationId: activeSpecialization?.id ?? null,
      specializationName: activeSpecialization?.name ?? null,
      moduleId: activeModuleId,
      conversationId: currentChatId,
    });
  }, [
    activeDiscipline,
    activeSpecialization,
    activeModuleId,
    currentChatId,
    updateWorkspace,
  ]);

  useEffect(() => {
    registerOrchestratorModuleRouter((moduleId, reason) => {
      if (activeModuleId !== moduleId) {
        openModule(moduleId);
      }
      console.debug(`[EIO] Module switch → ${moduleId}: ${reason}`);
    });
    return () => registerOrchestratorModuleRouter(null);
  }, [activeModuleId, openModule]);

  const currentChat = chats.find((chat) => chat.id === currentChatId) ?? null;
  const messages = currentChat?.messages ?? [];

  const sendMessageToAI = async (
    userMessage: string,
    chatId: string,
    addUserMessage = true
  ) => {
    if (isLoading) return;

    const targetChat = chats.find((chat) => chat.id === chatId) ?? null;
    if (!targetChat) return;

    const userMessageObject: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    const existingMessages = targetChat.messages;

    if (addUserMessage) {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;

          let title = chat.title;

          if (chat.messages.length === 0) {
            title = userMessage.split(" ").slice(0, 5).join(" ");

            if (title.length > 35) {
              title = `${title.substring(0, 35)}...`;
            }
          }

          return {
            ...chat,
            title,
            messages: [...chat.messages, userMessageObject],
          };
        })
      );
    }

    const history = existingMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);

    const resolvedWorkspace = {
      ...workspace,
      domain: activeDiscipline?.name ?? workspace.domain,
      specialization:
        activeSpecialization?.name ?? workspace.specialization,
    };

    runOrchestratorWithModuleRouting({
      userMessage,
      conversationId: chatId,
      disciplineId: activeDiscipline?.id ?? null,
      disciplineName: activeDiscipline?.name ?? resolvedWorkspace.domain,
      specializationId: activeSpecialization?.id ?? null,
      specializationName:
        activeSpecialization?.name ?? resolvedWorkspace.specialization,
      activeModuleId: activeModuleId ?? "ai-expert",
      conversationHistory: history,
      sessionTopic: getEngineeringSession().currentTopic,
      selectedStandardCode: selectedStandardKnowledge?.codeNumber ?? null,
    });

    try {
      const expertResponse = await processEngineeringExpertMessage({
        workspace: resolvedWorkspace,
        activeModuleId: activeModuleId ?? "ai-expert",
        activeDisciplineId: activeDiscipline?.id ?? null,
        activeDisciplineName: activeDiscipline?.name ?? resolvedWorkspace.domain,
        activeSpecializationId: activeSpecialization?.id ?? null,
        activeSpecializationName: activeSpecialization?.name ?? null,
        conversationId: chatId,
        userMessage,
        conversationHistory: history,
        selectedStandard: selectedStandardKnowledge,
        moduleSearchQuery,
      });

      if (abortController.signal.aborted) {
        return;
      }

      const session = getEngineeringSession();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: expertResponse.content,
        timestamp: new Date(),
        metadata: {
          followUpIntent: expertResponse.followUpIntent,
          providerId: expertResponse.providerId,
          disciplineId: activeDiscipline?.id ?? null,
          disciplineName: activeDiscipline?.name ?? workspace.domain,
          moduleId: activeModuleId ?? "ai-expert",
          sessionTopic: session.currentTopic,
          suggestedDeliverables: getSuggestedDeliverables({
            messageId: "",
            content: expertResponse.content,
            conversationId: chatId,
            disciplineId: activeDiscipline?.id ?? null,
            disciplineName: activeDiscipline?.name ?? workspace.domain,
            moduleId: activeModuleId ?? "ai-expert",
            sessionTopic: session.currentTopic,
          }),
          copilotSuggestions: expertResponse.copilotIntelligence.suggestions.slice(
            0,
            8
          ),
          copilotIntent: expertResponse.copilotIntelligence.userIntent,
          suggestedModuleId:
            expertResponse.copilotIntelligence.moduleRoute?.moduleId ?? null,
          projectId: getActiveProject()?.id ?? null,
          projectName: getActiveProject()?.name ?? null,
          activeAgentId: expertResponse.activeAgent?.agent.id ?? null,
          activeAgentName: expertResponse.activeAgent?.agent.name ?? null,
          decisionSupportActive: expertResponse.decisionSupport.active,
          decisionCategory: expertResponse.decisionSupport.category,
          decisionComparisonTitle:
            expertResponse.decisionSupport.decisionMatrix?.title ??
            expertResponse.decisionSupport.structuredOutput.problemStatement.slice(0, 80) ??
            null,
          decisionConfidenceLevel:
            expertResponse.decisionSupport.structuredOutput.confidenceLevel ??
            null,
          orchestratorIntent:
            expertResponse.orchestrator.classification.primaryIntent,
          orchestratorPrimaryModule:
            expertResponse.orchestrator.primaryModuleRoute?.moduleId ?? null,
          orchestratorMultiModule:
            expertResponse.orchestrator.executionPlan.isMultiModule,
          knowledgeEntryCount: expertResponse.knowledgeNetwork.entryCount,
          knowledgeStandardsCount:
            expertResponse.knowledgeNetwork.retrieval.standards.length,
          documentIntelligenceActive: expertResponse.documentIntelligence.active,
          documentIntent:
            expertResponse.documentIntelligence.payload?.detectedIntent ?? null,
          documentCount:
            expertResponse.documentIntelligence.payload?.activeDocuments
              .length ?? 0,
          complianceActive: expertResponse.compliance.active,
          complianceReviewIntent: expertResponse.compliance.reviewIntent,
          complianceScore: expertResponse.compliance.active
            ? expertResponse.compliance.scores.complianceScore
            : null,
          complianceConfidence: expertResponse.compliance.active
            ? expertResponse.compliance.scores.reviewConfidence
            : null,
          auditActive: expertResponse.audit.active,
          auditType: expertResponse.audit.auditType,
          auditReviewMode: expertResponse.audit.reviewMode,
          auditObservationCount: expertResponse.audit.observations.length,
          feedbackRecorded:
            expertResponse.intelligence.feedbackHandled !== null,
          experienceLevel: expertResponse.intelligence.profile.experienceLevel,
          assistantActive: expertResponse.assistant.active,
          pendingTaskCount: expertResponse.assistant.reminders.today.length +
            expertResponse.assistant.reminders.overdue.length,
          assistantTaskAction: expertResponse.assistant.taskAction,
          marketplaceActive: expertResponse.marketplace.active,
          marketplaceListingCount:
            expertResponse.marketplace.searchResult?.totalCount ?? 0,
          marketplaceListingAction: expertResponse.marketplace.listingAction,
          templatesActive: expertResponse.templates.active,
          templateCount: expertResponse.templates.searchResult?.totalCount ?? 0,
          documentGenerated: expertResponse.templates.generatedDocument !== null,
          templateAction: expertResponse.templates.templateAction,
          workflowAutomationActive: expertResponse.workflowAutomation.active,
          activeWorkflowTitle:
            expertResponse.workflowAutomation.activeWorkflow?.template.title ??
            null,
          workflowCompletionPercent:
            expertResponse.workflowAutomation.activeWorkflow?.completionPercent ??
            null,
          workflowAction: expertResponse.workflowAutomation.workflowAction,
          designWizardActive: expertResponse.designWizard.active,
          activeDesignTitle: expertResponse.designWizard.activeSession?.title ?? null,
          designStepProgress: expertResponse.designWizard.activeSession
            ? `${expertResponse.designWizard.activeSession.completedStepIds.length}/12`
            : null,
          designCompleteness:
            expertResponse.designWizard.validation?.completenessScore ?? null,
          designAction: expertResponse.designWizard.designAction,
          estimationActive: expertResponse.estimation.active,
          activeEstimateTitle: expertResponse.estimation.activeEstimate?.title ?? null,
          estimateItemCount: expertResponse.estimation.activeEstimate?.items.length ?? 0,
          estimateTotalCost: expertResponse.estimation.costBreakdown?.totalCost ?? null,
          estimationAction: expertResponse.estimation.estimationAction,
          tenderActive: expertResponse.tender.active,
          activeTenderTitle: expertResponse.tender.activeWorkspace?.title ?? null,
          tenderRiskCount: expertResponse.tender.riskCount,
          tenderAction: expertResponse.tender.tenderAction,
          contractActive: expertResponse.contracts.active,
          activeContractTitle: expertResponse.contracts.activeWorkspace?.title ?? null,
          contractRiskCount: expertResponse.contracts.riskCount,
          contractAction: expertResponse.contracts.contractAction,
          claimAction: expertResponse.contracts.claimAction,
          researchActive: expertResponse.research.active,
          activeResearchTopic: expertResponse.research.activeWorkspace?.title ?? null,
          researchAction: expertResponse.research.researchAction,
          researchReportAction: expertResponse.research.reportAction,
          mentorActive: expertResponse.mentor.active,
          activeMentorFocus: expertResponse.mentor.activeWorkspace?.focusArea ?? null,
          mentorAction: expertResponse.mentor.mentorAction,
          mentorReportAction: expertResponse.mentor.reportAction,
          knowledgeCaptureActive: expertResponse.knowledgeCapture.active,
          activeLessonsWorkspace: expertResponse.knowledgeCapture.activeWorkspace?.title ?? null,
          lessonCount: expertResponse.knowledgeCapture.activeWorkspace?.lessons.length ?? 0,
          lessonAction: expertResponse.knowledgeCapture.lessonAction,
          lessonReportAction: expertResponse.knowledgeCapture.reportAction,
          siteExecutionActive: expertResponse.siteExecution.active,
          activeSiteWorkspace: expertResponse.siteExecution.activeWorkspace?.title ?? null,
          siteExecutionPhase: expertResponse.siteExecution.activeWorkspace?.phase ?? null,
          siteExecutionAction: expertResponse.siteExecution.executionAction,
          siteReportAction: expertResponse.siteExecution.reportAction,
          dashboardActive: expertResponse.dashboard.active,
          dashboardAction: expertResponse.dashboard.dashboardAction,
          dashboardSearchCount: expertResponse.dashboard.searchResultCount,
        },
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;

          return {
            ...chat,
            messages: [...chat.messages, assistantMessage],
          };
        })
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error(error);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "The Engineering AI Expert engine encountered an error while preparing a response.",
        timestamp: new Date(),
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;

          return {
            ...chat,
            messages: [...chat.messages, assistantMessage],
          };
        })
      );
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    if (!currentChatId || isLoading) return;
    await sendMessageToAI(userMessage, currentChatId, true);
  };

  useEffect(() => {
    const state = location.state as {
      decisionPrompt?: string;
      standardsPrompt?: string;
      knowledgePrompt?: string;
      memoryPrompt?: string;
    } | null;
    const prompt =
      state?.decisionPrompt?.trim() ??
      state?.standardsPrompt?.trim() ??
      state?.knowledgePrompt?.trim() ??
      state?.memoryPrompt?.trim();
    if (!prompt || !currentChatId || isLoading) {
      return;
    }
    void handleSendMessage(prompt);
    navigate(location.pathname + location.search, { replace: true, state: null });
  }, [currentChatId, isLoading, location.pathname, location.search, location.state, navigate]);

  const handleStop = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setIsLoading(false);
  };

  const handleClearChat = () => {
    if (!currentChatId || isLoading) return;

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) return chat;

        return {
          ...chat,
          title: "New Chat",
          messages: [],
        };
      })
    );
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!currentChatId || isLoading) return;
    void handleSendMessage(prompt);
  };

  const handleRegenerateLastResponse = async () => {
    if (!currentChatId || isLoading || !currentChat) return;

    const messages = currentChat.messages;
    const lastAssistantIndex = [...messages]
      .map((message, index) => ({ message, index }))
      .reverse()
      .find((entry) => entry.message.role === "assistant")?.index;

    if (lastAssistantIndex === undefined) return;

    const precedingUser = messages
      .slice(0, lastAssistantIndex)
      .reverse()
      .find((message) => message.role === "user");

    if (!precedingUser) return;

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) return chat;
        return {
          ...chat,
          messages: chat.messages.slice(0, lastAssistantIndex),
        };
      })
    );

    await sendMessageToAI(precedingUser.content, currentChatId, false);
  };

  const handleActionResult = (result: EngineeringActionResult) => {
    if (!result.followUpPrompt) return;

    if (result.followUpPrompt === "__REGENERATE__") {
      void handleRegenerateLastResponse();
      return;
    }

    void handleSendMessage(result.followUpPrompt);
  };

  const handleSearchSelect = (result: EngineeringSearchResult) => {
    const discipline = getDisciplineDefinitionByName(result.disciplineName);

    if (discipline) {
      selectDiscipline(discipline.id, discipline.name);
    }

    if (result.type === "standard" && discipline) {
      const resolved = resolveStandardsWithKnowledge({
        ...workspace,
        domain: discipline.name,
      });
      const standard = resolved.standards.find(
        (entry) => entry.id === result.resourceId
      );

      if (standard) {
        openStandard(standard);
      }
    }

    if (result.type === "knowledge" && discipline) {
      const specs = getNavigatorSpecializations(discipline.id, discipline.name);
      const match = specs.find((entry) => entry.node.name === result.title);
      if (match) {
        selectSpecialization(match.path);
      } else {
        setSpecialization(result.title);
      }
    }
  };

  return (
    <div
      className="grid h-screen min-h-0 overflow-hidden bg-slate-950 transition-[grid-template-columns] duration-[250ms] ease-in-out"
      style={{
        gridTemplateColumns: getAppShellGridColumns(
          isAppNavCollapsed,
          isDesktopShell,
          isModulePanelCollapsed
        ),
        gridTemplateRows: "auto 1fr",
      }}
    >
      <div className="min-h-0 overflow-hidden" style={{ gridRow: "1 / -1" }}>
        <Sidebar />
      </div>

      <WorkspaceGlobalHeader
        onSelectResult={handleSearchSelect}
        style={{
          gridColumn: isDesktopShell ? "2 / -1" : "2",
          gridRow: "1",
        }}
      />

      <div
        className="hidden min-h-0 min-w-0 overflow-hidden lg:block"
        style={{ gridColumn: "2", gridRow: "2" }}
      >
        <EngineeringNavigator />
      </div>

      <SarathiChatColumn
        className="min-h-0 min-w-0"
        style={{
          gridColumn: isDesktopShell ? "3" : "2",
          gridRow: "2",
        }}
        messages={messages}
        isLoading={isLoading}
        conversationId={currentChatId ?? undefined}
        onSendMessage={handleSendMessage}
        onStop={handleStop}
        onClearChat={handleClearChat}
        onSelectPrompt={handleQuickPrompt}
        onActionResult={handleActionResult}
      />

      <div
        className="hidden min-h-0 min-w-0 overflow-hidden lg:block"
        style={{ gridColumn: "4", gridRow: "2" }}
      >
        <EngineeringModulePanel />
      </div>

      {!isDesktopShell ? <ModulePreviewSheet /> : null}
    </div>
  );
};

export default ChatPage;
