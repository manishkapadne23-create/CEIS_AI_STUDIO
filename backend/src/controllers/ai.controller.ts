import { Request, Response } from "express";

import { auditLogger } from "../infrastructure/logger/index.js";
import { recordMetric } from "../monitoring/metrics.js";
import {
  buildDigitalWatermark,
  logSecurityAudit,
  sanitizeAiClientResponse,
} from "../security/index.js";
import {
  completeAI,
  getAIProviderSettings,
  getAIResponse,
  getAIResponseNormalized,
  checkAiProviderHealth,
  type AIHistoryMessage,
} from "../services/ai.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { ValidationError } from "../utils/AppError.js";

const validateHistory = (history: unknown): AIHistoryMessage[] => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (item): item is AIHistoryMessage =>
        item !== null &&
        typeof item === "object" &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0
    )
    .slice(-12);
};

const validateMessage = (message: unknown): string => {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ValidationError("Message is required.");
  }
  return message.trim();
};

export const chatWithAI = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const { message, domainId, domainName, history = [] } = req.body;
  const validatedMessage = validateMessage(message);
  const validatedHistory = validateHistory(history);

  const reply = await getAIResponse(
    validatedMessage,
    domainId ?? null,
    domainName ?? null,
    validatedHistory,
    req.user?.id
  );

  auditLogger.info("ai.chat", {
    userId: req.user?.id,
    domainId: domainId ?? null,
    messageLength: validatedMessage.length,
  });

  await logSecurityAudit({
    category: "AI",
    eventType: "ai.chat",
    userId: req.user?.id,
    ipAddress: req.ip,
    userAgent: req.header("user-agent"),
    metadata: { domainId: domainId ?? null, messageLength: validatedMessage.length },
  });

  const watermark = buildDigitalWatermark({
    userId: req.user?.id,
    contentType: "ai-chat",
  });

  recordMetric("ai.chat", Date.now() - start);
  sendSuccess(res, { reply }, { meta: { watermark } });
});

export const completeAIRequest = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const {
    message,
    domainId,
    domainName,
    specializationId,
    specializationName,
    history = [],
    systemPrompt,
    moduleId,
    moduleTitle,
    projectContext,
    language,
    subscriptionPlan,
    memorySummary,
    knowledgeReferences,
  } = req.body;

  const validatedMessage = validateMessage(message);
  const validatedHistory = validateHistory(history);

  const result = await getAIResponseNormalized({
    message: validatedMessage,
    domainId: domainId ?? null,
    domainName: domainName ?? null,
    specializationId: specializationId ?? null,
    specializationName: specializationName ?? null,
    history: validatedHistory,
    systemPrompt: typeof systemPrompt === "string" ? systemPrompt : undefined,
    moduleId: moduleId ?? null,
    moduleTitle: moduleTitle ?? null,
    projectContext: projectContext ?? null,
    language: typeof language === "string" ? language : undefined,
    subscriptionPlan:
      typeof subscriptionPlan === "string" ? subscriptionPlan : undefined,
    memorySummary: memorySummary ?? null,
    knowledgeReferences: Array.isArray(knowledgeReferences)
      ? knowledgeReferences.filter((r): r is string => typeof r === "string")
      : undefined,
    userId: req.user?.id,
  });

  auditLogger.info("ai.complete", {
    userId: req.user?.id,
    providerId: result.response.providerId,
    usedFallback: result.response.usedFallback,
    tokens: result.response.usage.totalTokens,
  });

  await logSecurityAudit({
    category: "AI",
    eventType: "ai.complete",
    userId: req.user?.id,
    ipAddress: req.ip,
    userAgent: req.header("user-agent"),
    metadata: {
      providerId: result.response.providerId,
      tokens: result.response.usage.totalTokens,
    },
  });

  const watermark = buildDigitalWatermark({
    userId: req.user?.id,
    contentType: "ai-complete",
    workspaceId: typeof req.body.workspaceId === "string" ? req.body.workspaceId : null,
  });

  recordMetric("ai.complete", Date.now() - start);
  sendSuccess(res, sanitizeAiClientResponse(result), { meta: { watermark } });
});

export const streamAIRequest = asyncHandler(async (req: Request, res: Response) => {
  const {
    message,
    domainId,
    domainName,
    specializationId,
    specializationName,
    history = [],
    systemPrompt,
    moduleId,
    moduleTitle,
    projectContext,
    language,
    subscriptionPlan,
    memorySummary,
    knowledgeReferences,
  } = req.body;

  const validatedMessage = validateMessage(message);
  const validatedHistory = validateHistory(history);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const abortController = new AbortController();
  req.on("close", () => abortController.abort());

  try {
    const { response } = await completeAI({
      message: validatedMessage,
      domainId: domainId ?? null,
      domainName: domainName ?? null,
      specializationId: specializationId ?? null,
      specializationName: specializationName ?? null,
      history: validatedHistory,
      systemPrompt: typeof systemPrompt === "string" ? systemPrompt : undefined,
      moduleId: moduleId ?? null,
      moduleTitle: moduleTitle ?? null,
      projectContext: projectContext ?? null,
      language: typeof language === "string" ? language : undefined,
      subscriptionPlan:
        typeof subscriptionPlan === "string" ? subscriptionPlan : undefined,
      memorySummary: memorySummary ?? null,
      knowledgeReferences: Array.isArray(knowledgeReferences)
        ? knowledgeReferences.filter((r): r is string => typeof r === "string")
        : undefined,
      userId: req.user?.id,
    });

    if (abortController.signal.aborted) {
      return;
    }

    const content = response.detailedResponse || response.rawContent;
    const chunkSize = 48;

    for (let i = 0; i < content.length; i += chunkSize) {
      if (abortController.signal.aborted) {
        res.write(`data: ${JSON.stringify({ type: "error", error: "cancelled" })}\n\n`);
        return res.end();
      }

      const chunk = content.slice(i, i + chunkSize);
      res.write(`data: ${JSON.stringify({ type: "token", content: chunk })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 8));
    }

    await logSecurityAudit({
      category: "AI",
      eventType: "ai.stream",
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.header("user-agent"),
    });

    const watermark = buildDigitalWatermark({
      userId: req.user?.id,
      contentType: "ai-stream",
    });

    const safeResponse = sanitizeAiClientResponse({ response });
    res.write(
      `data: ${JSON.stringify({ type: "done", response: safeResponse.response, watermark })}\n\n`
    );
    res.end();
  } catch (error) {
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        error: error instanceof Error ? error.message : "Stream failed",
      })}\n\n`
    );
    res.end();
  }
});

export const getProviderHealth = asyncHandler(async (_req: Request, res: Response) => {
  const health = await checkAiProviderHealth();
  sendSuccess(res, { providers: health });
});

export const getProviderSettings = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, getAIProviderSettings());
});

/** Legacy response shape for backward compatibility */
export const chatWithAILegacy = asyncHandler(async (req: Request, res: Response) => {
  const start = Date.now();
  const { message, domainId, domainName, history = [] } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return sendError(res, 400, "VALIDATION_ERROR", "Message is required.");
  }

  const reply = await getAIResponse(
    message.trim(),
    domainId ?? null,
    domainName ?? null,
    validateHistory(history),
    req.user?.id
  );

  recordMetric("ai.chat.legacy", Date.now() - start);
  return res.json({ success: true, reply });
});
