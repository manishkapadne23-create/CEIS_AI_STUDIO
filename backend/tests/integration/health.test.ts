import { describe, it, expect } from "vitest";

import { getLiveness, getReadiness } from "../../src/monitoring/health.ts";
import { getMetrics, recordMetric, resetMetrics } from "../../src/monitoring/metrics.ts";
import { config } from "../../src/config/index.ts";

describe("Monitoring", () => {
  it("liveness returns ok", () => {
    expect(getLiveness()).toEqual({ status: "ok" });
  });

  it("readiness handles missing database gracefully", async () => {
    const result = await getReadiness();
    expect(typeof result.ready).toBe("boolean");
  });

  it("records and retrieves metrics", () => {
    resetMetrics();
    recordMetric("test.route", 100);
    const metrics = getMetrics();
    expect(metrics["test.route"]?.count).toBe(1);
  });

  it("config loads testing environment", () => {
    expect(config.env).toBe("testing");
  });
});
