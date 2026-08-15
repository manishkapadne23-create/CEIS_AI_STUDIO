import { describe, expect, it } from "vitest";

import { getArchitectureSummary, listArchitectureModules } from "../../src/governance/architectureRegistry.js";
import { validateCodingStandards } from "../../src/governance/codingStandards.js";
import { analyzeDependencies } from "../../src/governance/dependencyManager.js";
import { generateGovernanceReport } from "../../src/governance/governanceManager.js";
import { parseSemver } from "../../src/governance/releaseManager.js";
import { runQualityGates } from "../../src/governance/qualityEngine.js";
import { validateApiGovernance } from "../../src/governance/apiGovernance.js";
import { runSecurityChecks } from "../../src/governance/securityChecker.js";

describe("Enterprise Architecture Governance Framework", () => {
  it("maintains architecture module registry", () => {
    const modules = listArchitectureModules();
    expect(modules.length).toBeGreaterThanOrEqual(20);

    const summary = getArchitectureSummary();
    expect(summary.totalModules).toBe(modules.length);
    expect(summary.byCategory["engineering-module"]).toBeGreaterThan(0);
    expect(summary.byCategory["ai-module"]).toBeGreaterThan(0);
    expect(summary.byCategory["plugin"]).toBeGreaterThan(0);
  });

  it("analyzes dependencies and reports graph health", () => {
    const report = analyzeDependencies();
    expect(report.modules.length).toBeGreaterThan(0);
    expect(report.sharedComponents.length).toBeGreaterThan(0);
    expect(Array.isArray(report.circularDependencies)).toBe(true);
  });

  it("enforces coding standards", () => {
    const standards = validateCodingStandards();
    expect(standards.length).toBeGreaterThanOrEqual(10);
    expect(standards.every((rule) => rule.enforced)).toBe(true);
  });

  it("passes quality gates", async () => {
    const quality = await runQualityGates();
    expect(quality.gates.length).toBe(7);
    expect(quality.passed).toBe(true);
  });

  it("validates API governance rules", () => {
    const rules = validateApiGovernance();
    expect(rules.every((rule) => rule.compliant)).toBe(true);
  });

  it("runs security checks", () => {
    const checks = runSecurityChecks();
    expect(checks.length).toBeGreaterThanOrEqual(5);
    expect(checks.find((check) => check.id === "audit-logs")?.passed).toBe(true);
  });

  it("supports semantic versioning", () => {
    const version = parseSemver("1.2.3");
    expect(version).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it("generates full governance report", async () => {
    const report = await generateGovernanceReport();
    expect(report.version).toBeTruthy();
    expect(report.architecture.totalModules).toBeGreaterThan(0);
    expect(report.quality.passed).toBe(true);
    expect(report.documentation.artifacts.length).toBeGreaterThan(0);
  });
});
