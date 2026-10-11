
import app from "./app.js";
import prisma from "./config/prisma.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`SchoolPulse backend running on port ${env.PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async (error) => {
    if (error) {
      console.error("Error closing HTTP server:", error);
      process.exitCode = 1;
    }

    try {
      await prisma.$disconnect();
      console.log("Prisma disconnected successfully.");
    } catch (disconnectError) {
      console.error("Error disconnecting Prisma:", disconnectError);
      process.exitCode = 1;
    }

    if (error) {
      process.exitCode = 1;
    }
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});