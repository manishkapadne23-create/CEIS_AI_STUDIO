import { appLogger } from "../logger/index.js";

export interface RetryOptions {
  attempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: unknown) => void;
}

export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const attempts = options.attempts ?? 3;
  const delayMs = options.delayMs ?? 500;
  const backoffMultiplier = options.backoffMultiplier ?? 2;

  let lastError: unknown;
  let wait = delayMs;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      options.onRetry?.(attempt, error);
      appLogger.warn(`Retry attempt ${attempt}/${attempts}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      await new Promise((resolve) => setTimeout(resolve, wait));
      wait *= backoffMultiplier;
    }
  }

  throw lastError;
};
