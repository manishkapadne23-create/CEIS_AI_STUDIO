import {
  getDisciplineActions,
  type DisciplineActionDefinition,
} from "./actionCatalog";
import { generateFromTemplate } from "./templateGenerator";
import {
  exportAsDocx,
  exportAsPdf,
  exportAsXlsx,
  triggerDownload,
} from "./exportEngine";
import { resolveWorkspaceCategory, saveToWorkspace } from "./workspaceSaver";
import { getActiveProject, saveItemToProject } from "../projects";
import type {
  ActionBarActionId,
  EngineeringActionContext,
  EngineeringActionResult,
  EngineeringDeliverableType,
  GeneratedEngineeringOutput,
} from "./types";

export const buildActionContext = (options: {
  messageId: string;
  content: string;
  conversationId: string;
  disciplineId?: string | null;
  disciplineName?: string | null;
  moduleId?: string | null;
  sessionTopic?: string | null;
  metadata?: EngineeringActionContext["metadata"];
}): EngineeringActionContext => ({
  messageId: options.messageId,
  content: options.content,
  conversationId: options.conversationId,
  disciplineId: options.disciplineId ?? null,
  disciplineName: options.disciplineName ?? null,
  moduleId: (options.moduleId as EngineeringActionContext["moduleId"]) ?? null,
  sessionTopic: options.sessionTopic ?? null,
  metadata: options.metadata,
});

export const getSuggestedDeliverables = (
  context: EngineeringActionContext
): EngineeringDeliverableType[] =>
  getDisciplineActions(context.disciplineId, context.disciplineName).map(
    (action) => action.deliverableType
  );

export const generateDeliverable = (
  context: EngineeringActionContext,
  deliverableType: EngineeringDeliverableType
): GeneratedEngineeringOutput => {
  const catalog = getDisciplineActions(
    context.disciplineId,
    context.disciplineName
  );
  const match = catalog.find((entry) => entry.deliverableType === deliverableType);

  return generateFromTemplate(context, {
    deliverableType,
    outputType: match?.outputType,
  });
};

export const getDeliverableFollowUpPrompt = (
  action: DisciplineActionDefinition,
  context: EngineeringActionContext
): string => {
  const topic = context.sessionTopic ?? "the current engineering topic";
  return `${action.promptTemplate}\n\nContinue from our discussion on ${topic}.`;
};

export const dispatchEngineeringAction = async (
  actionId: ActionBarActionId,
  context: EngineeringActionContext,
  deliverableType?: EngineeringDeliverableType
): Promise<EngineeringActionResult> => {
  switch (actionId) {
    case "copy":
      return copyToClipboard(context.content);

    case "generate-pdf": {
      const output = deliverableType
        ? generateDeliverable(context, deliverableType)
        : null;
      const exportResult = exportAsPdf({
        content: output?.content ?? context.content,
        title: output?.title ?? "Sarathi Engineering Output",
        disciplineName: context.disciplineName,
        outputType: output?.outputType,
      });
      triggerDownload(exportResult.blob, exportResult.filename);
      return {
        success: true,
        message: exportResult.message,
      };
    }

    case "export-word": {
      const output = deliverableType
        ? generateDeliverable(context, deliverableType)
        : null;
      const exportResult = exportAsDocx({
        content: output?.content ?? context.content,
        title: output?.title ?? "Sarathi Engineering Output",
        disciplineName: context.disciplineName,
        outputType: output?.outputType,
      });
      triggerDownload(exportResult.blob, exportResult.filename);
      return {
        success: true,
        message: exportResult.message,
      };
    }

    case "export-excel": {
      const output = deliverableType
        ? generateDeliverable(context, deliverableType)
        : null;
      const exportResult = exportAsXlsx({
        content: output?.content ?? context.content,
        title: output?.title ?? "Sarathi Engineering Output",
        disciplineName: context.disciplineName,
        outputType: output?.outputType,
      });
      triggerDownload(exportResult.blob, exportResult.filename);
      return {
        success: true,
        message: exportResult.message,
      };
    }

    case "share":
      return shareContent(context);

    case "save-workspace": {
      const output = deliverableType
        ? generateDeliverable(context, deliverableType)
        : null;
      const activeProject = getActiveProject();
      const saved = saveToWorkspace({
        title: output?.title ?? `Sarathi Output — ${new Date().toLocaleDateString()}`,
        content: output?.content ?? context.content,
        category: resolveWorkspaceCategory(
          output?.deliverableType ?? deliverableType
        ),
        disciplineId: context.disciplineId,
        disciplineName: context.disciplineName,
        deliverableType: output?.deliverableType ?? deliverableType,
        outputType: output?.outputType,
        conversationId: context.conversationId,
        messageId: context.messageId,
        projectId: activeProject?.id,
      });

      if (activeProject) {
        saveItemToProject({
          projectId: activeProject.id,
          type:
            saved.category === "reports"
              ? "report"
              : saved.category === "calculations"
                ? "calculation"
                : saved.category === "templates"
                  ? "template"
                  : "saved-output",
          title: saved.title,
          content: saved.content,
          conversationId: context.conversationId,
          messageId: context.messageId,
          tags: ["saved-from-chat"],
        });
      }

      return {
        success: true,
        message: `Saved to My Workspace → ${saved.category} (${saved.title})${activeProject ? ` + Project: ${activeProject.name}` : ""}`,
      };
    }

    case "continue-conversation":
      return {
        success: true,
        message: "Continuing conversation",
        followUpPrompt: "Continue with the next engineering step for this project.",
      };

    case "regenerate":
      return {
        success: true,
        message: "Regenerating response",
        followUpPrompt: "__REGENERATE__",
      };

    case "translate":
      return {
        success: true,
        message: "Translation requested",
        followUpPrompt:
          "Translate the previous engineering response into Hindi, keeping technical terms accurate.",
      };

    case "print":
      return printContent(context.content);

    case "generate-deliverable": {
      if (!deliverableType) {
        return { success: false, message: "No deliverable type specified." };
      }
      const output = generateDeliverable(context, deliverableType);
      const catalog = getDisciplineActions(
        context.disciplineId,
        context.disciplineName
      );
      const match = catalog.find(
        (entry) => entry.deliverableType === deliverableType
      );
      return {
        success: true,
        message: `Generated ${output.title}`,
        followUpPrompt: match
          ? getDeliverableFollowUpPrompt(match, context)
          : `Generate ${deliverableType} for the current project.`,
        download: {
          blob: new Blob([output.content], { type: "text/markdown" }),
          filename: `${output.title.replace(/\s+/g, "-").toLowerCase()}.md`,
        },
      };
    }

    default:
      return { success: false, message: `Unknown action: ${actionId}` };
  }
};

const copyToClipboard = async (content: string): Promise<EngineeringActionResult> => {
  try {
    await navigator.clipboard.writeText(content);
    return { success: true, message: "Copied to clipboard" };
  } catch {
    return { success: false, message: "Failed to copy" };
  }
};

const shareContent = async (
  context: EngineeringActionContext
): Promise<EngineeringActionResult> => {
  const shareData = {
    title: "Sarathi AI Engineering Output",
    text: context.content.slice(0, 500),
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return { success: true, message: "Shared successfully" };
    } catch {
      return copyToClipboard(context.content);
    }
  }

  return copyToClipboard(context.content);
};

const printContent = (content: string): EngineeringActionResult => {
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) {
    return { success: false, message: "Unable to open print window" };
  }

  printWindow.document.write(`
    <html>
      <head><title>Sarathi AI — Print</title></head>
      <body style="font-family: system-ui, sans-serif; padding: 24px; white-space: pre-wrap;">
        ${content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();

  return { success: true, message: "Print dialog opened" };
};
