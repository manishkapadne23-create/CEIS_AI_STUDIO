import { ensureEnvLoaded } from "./config/loadEnv.js";
import { config } from "./config/index.js";
import { appLogger } from "./infrastructure/logger/index.js";
import { stopJobScheduler } from "./infrastructure/queue/index.js";
import { connectDatabase, disconnectDatabase } from "./prisma/prisma.js";

const startServer = async (): Promise<void> => {
  ensureEnvLoaded();

  const maskedDbUrl = config.database.url.replace(/:([^:@/]+)@/, ":***@");
  appLogger.info("Startup database configuration", {
    databaseUrl: maskedDbUrl,
    cwd: process.cwd(),
  });

  try {
    await connectDatabase();
  } catch (error) {
    appLogger.warn("Database connection failed at startup — API will run in degraded mode", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const { default: app } = await import("./app.js");

  const server = app.listen(config.port, config.host, () => {
    appLogger.info(`Sarathi AI server running`, {
      port: config.port,
      host: config.host,
      environment: config.env,
      api: `http://${config.host}:${config.port}/api/${config.apiVersion}`,
    });
  });

  const shutdown = async (signal: string): Promise<void> => {
    appLogger.info(`${signal} received — shutting down gracefully`);
    stopJobScheduler();
    server.close(async () => {
      await disconnectDatabase();
      appLogger.info("Server shut down complete");
      process.exit(0);
    });
    setTimeout(() => {
      appLogger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
};

startServer().catch((error) => {
  appLogger.error("Failed to start server", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
