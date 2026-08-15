import { appLogger } from "../infrastructure/logger/index.js";
import { cleanupTempFiles } from "../infrastructure/storage/index.js";
import {
  enqueueJob,
  registerJobHandler,
  startJobScheduler,
} from "../infrastructure/queue/index.js";

registerJobHandler("notification", async (job) => {
  appLogger.info("Processing notification job", job.payload);
});

registerJobHandler("email", async (job) => {
  appLogger.info("Processing email job", job.payload);
  // Future: integrate SMTP / SendGrid
});

registerJobHandler("knowledge-update", async (job) => {
  appLogger.info("Processing knowledge update job", job.payload);
});

registerJobHandler("maintenance", async (job) => {
  const removed = cleanupTempFiles();
  appLogger.info("Scheduled maintenance completed", {
    tempFilesRemoved: removed,
    scheduled: job.payload.scheduled ?? false,
  });
});

export const initBackgroundJobs = (): void => {
  startJobScheduler();
  appLogger.info("Background job handlers registered");
};

export const scheduleNotification = (payload: Record<string, unknown>): string =>
  enqueueJob("notification", payload);

export const scheduleEmail = (payload: Record<string, unknown>): string =>
  enqueueJob("email", payload);

export const scheduleKnowledgeUpdate = (payload: Record<string, unknown>): string =>
  enqueueJob("knowledge-update", payload);
