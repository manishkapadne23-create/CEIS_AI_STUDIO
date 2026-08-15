#!/usr/bin/env node
/**
 * Sarathi AI — Governance Quality Gate Runner
 * Usage: node scripts/governance-check.mjs
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, "..");
const rootDir = path.resolve(backendDir, "..");

const run = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: true });
  return result.status === 0;
};

const gates = [
  { name: "Type Safety (Backend)", passed: run("npm", ["run", "lint"], backendDir) },
  { name: "Unit Tests", passed: run("npm", ["test"], backendDir) },
  { name: "Build (Backend)", passed: run("npm", ["run", "build"], backendDir) },
  { name: "Build (Frontend)", passed: run("npm", ["run", "build"], path.join(rootDir, "frontend")) },
];

console.log("\n=== Sarathi AI Governance Quality Gates ===\n");

let allPassed = true;
for (const gate of gates) {
  const status = gate.passed ? "PASS" : "FAIL";
  console.log(`[${status}] ${gate.name}`);
  if (!gate.passed) allPassed = false;
}

console.log(`\n${allPassed ? "All quality gates passed." : "Some quality gates failed."}\n`);
process.exit(allPassed ? 0 : 1);
