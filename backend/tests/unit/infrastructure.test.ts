import { describe, it, expect, beforeEach } from "vitest";

import { sanitizeOutput } from "../../src/middleware/validate.ts";
import { withRetry } from "../../src/infrastructure/retry/index.ts";
import { clearRateLimitBuckets } from "../../src/middleware/rateLimiter.ts";
import { sendSuccess, sendError } from "../../src/utils/apiResponse.ts";
import { AppError, ValidationError } from "../../src/utils/AppError.ts";

describe("sanitizeOutput", () => {
  it("escapes HTML characters", () => {
    expect(sanitizeOutput('<script>alert("xss")</script>')).not.toContain("<script>");
  });
});

describe("withRetry", () => {
  it("retries on failure and succeeds", async () => {
    let attempts = 0;
    const result = await withRetry(
      async () => {
        attempts += 1;
        if (attempts < 2) throw new Error("fail");
        return "ok";
      },
      { attempts: 3, delayMs: 10 }
    );
    expect(result).toBe("ok");
    expect(attempts).toBe(2);
  });

  it("throws after max attempts", async () => {
    await expect(
      withRetry(async () => { throw new Error("always fails"); }, { attempts: 2, delayMs: 10 })
    ).rejects.toThrow("always fails");
  });
});

describe("AppError", () => {
  it("creates validation error with correct code", () => {
    const err = new ValidationError("Invalid input");
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
  });

  it("creates operational app error", () => {
    const err = new AppError("Not found", 404, "NOT_FOUND");
    expect(err.isOperational).toBe(true);
  });
});

describe("apiResponse helpers", () => {
  it("sendSuccess structure", () => {
    const res = {
      status: (code: number) => ({
        json: (body: unknown) => ({ code, body }),
      }),
    };
    const result = sendSuccess(res as never, { id: 1 }, { message: "ok" });
    expect((result as { body: { success: boolean } }).body.success).toBe(true);
  });

  it("sendError structure", () => {
    const res = {
      status: (code: number) => ({
        json: (body: unknown) => ({ code, body }),
      }),
    };
    const result = sendError(res as never, 400, "VALIDATION_ERROR", "Bad request");
    const body = (result as { body: { success: boolean; error: { code: string } } }).body;
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});

describe("rateLimiter", () => {
  beforeEach(() => {
    clearRateLimitBuckets();
  });

  it("clears buckets without error", () => {
    expect(() => clearRateLimitBuckets()).not.toThrow();
  });
});
