import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    env: {
      NODE_ENV: "testing",
      JOBS_ENABLED: "false",
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/sarathi_ai_test",
      JWT_SECRET: "test_secret",
    },
  },
});
