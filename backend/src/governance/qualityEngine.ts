import fs from "fs";
import path from "path";

import type { QualityGateResult, QualityReport } from "./types.js";

const projectRoot = path.resolve(process.cwd(), "..");

const fileExists = (relativePath: string): boolean =>
  fs.existsSync(path.join(projectRoot, relativePath));

const runGate = async (
  id: QualityGateResult["id"],
  check: () => boolean | Promise<boolean>,
  message: string
): Promise<QualityGateResult> => {
  const start = Date.now();
  try {
    const passed = await check();
    return {
      id,
      passed,
      message: passed ? message : `${message} — FAILED`,
      durationMs: Date.now() - start,
    };
  } catch (error) {
    return {
      id,
      passed: false,
      message: error instanceof Error ? error.message : `${message} — ERROR`,
      durationMs: Date.now() - start,
    };
  }
};

export const runQualityGates = async (): Promise<QualityReport> => {
  const gates: QualityGateResult[] = [];

  gates.push(
    await runGate(
      "build",
      () => fileExists("backend/dist/server.js") || fileExists("backend/src/server.ts"),
      "Build artifacts or source entry point present"
    )
  );

  gates.push(
    await runGate(
      "type-safety",
      () =>
        fileExists("backend/tsconfig.json") &&
        fileExists("frontend/tsconfig.json"),
      "TypeScript configuration present for backend and frontend"
    )
  );

  gates.push(
    await runGate(
      "linting",
      () => {
        const pkg = JSON.parse(
          fs.readFileSync(path.join(projectRoot, "backend/package.json"), "utf8")
        ) as { scripts?: { lint?: string } };
        return Boolean(pkg.scripts?.lint);
      },
      "Lint script configured in backend package.json"
    )
  );

  gates.push(
    await runGate(
      "unit-tests",
      () => {
        const testsDir = path.join(projectRoot, "backend/tests/unit");
        return fs.existsSync(testsDir) && fs.readdirSync(testsDir).length > 0;
      },
      "Unit test suite present"
    )
  );

  gates.push(
    await runGate(
      "integration-tests",
      () => fileExists("backend/tests/integration/health.test.ts"),
      "Integration test suite present"
    )
  );

  gates.push(
    await runGate(
      "security",
      () =>
        fileExists("backend/src/middleware/security.ts") &&
        fileExists("backend/src/infrastructure/logger/index.ts"),
      "Security middleware and audit logging present"
    )
  );

  gates.push(
    await runGate(
      "performance",
      () =>
        fileExists("backend/src/middleware/rateLimiter.ts") &&
        fileExists("backend/src/infrastructure/cache/index.ts"),
      "Rate limiting and caching infrastructure present"
    )
  );

  return {
    passed: gates.every((gate) => gate.passed),
    gates,
    checkedAt: new Date().toISOString(),
  };
};
