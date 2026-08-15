import crypto from "crypto";

import { config } from "../../config/index.js";
import { appLogger } from "../logger/index.js";

export type JobType =
  | "notification"
  | "email"
  | "knowledge-update"
  | "maintenance";

export interface Job {
  id: string;
  type: JobType;
  payload: Record<string, unknown>;
  createdAt: number;
  attempts: number;
}

type JobHandler = (job: Job) => Promise<void>;

const handlers = new Map<JobType, JobHandler>();
const queue: Job[] = [];
let processing = false;
let maintenanceTimer: ReturnType<typeof setInterval> | null = null;

export const registerJobHandler = (type: JobType, handler: JobHandler): void => {
  handlers.set(type, handler);
};

export const enqueueJob = (type: JobType, payload: Record<string, unknown> = {}): string => {
  const job: Job = {
    id: crypto.randomUUID(),
    type,
    payload,
    createdAt: Date.now(),
    attempts: 0,
  };
  queue.push(job);
  appLogger.debug("Job enqueued", { jobId: job.id, type });
  void processQueue();
  return job.id;
};

const processQueue = async (): Promise<void> => {
  if (processing || queue.length === 0) return;
  processing = true;

  while (queue.length > 0) {
    const job = queue.shift();
    if (!job) break;

    const handler = handlers.get(job.type);
    if (!handler) {
      appLogger.warn("No handler for job type", { type: job.type });
      continue;
    }

    try {
      job.attempts += 1;
      await handler(job);
      appLogger.debug("Job completed", { jobId: job.id, type: job.type });
    } catch (error) {
      appLogger.error("Job failed", {
        jobId: job.id,
        type: job.type,
        error: error instanceof Error ? error.message : String(error),
      });
      if (job.attempts < 3) queue.push(job);
    }
  }

  processing = false;
};

export const startJobScheduler = (): void => {
  if (!config.jobs.enabled) {
    appLogger.info("Background jobs disabled");
    return;
  }

  if (maintenanceTimer) return;

  maintenanceTimer = setInterval(() => {
    enqueueJob("maintenance", { scheduled: true });
  }, config.jobs.maintenanceIntervalMs);

  appLogger.info("Background job scheduler started");
};

export const stopJobScheduler = (): void => {
  if (maintenanceTimer) {
    clearInterval(maintenanceTimer);
    maintenanceTimer = null;
  }
};

export const getQueueStats = (): { pending: number; handlers: JobType[] } => ({
  pending: queue.length,
  handlers: [...handlers.keys()],
});
