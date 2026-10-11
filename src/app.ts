import express from "express";
import prisma from "./config/prisma.js";
import errorMiddleware from "./middleware/error.middleware.js";
import loggerMiddleware from "./middleware/logger.middleware.js";
import studentRouter from "./modules/students/route.js";


const app = express();

app.use(loggerMiddleware);
app.use("/api/students", studentRouter);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SchoolPulse backend is running",
  });
});

app.get("/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "ok",
      message: "Database connection is healthy",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(503).json({
      status: "error",
      message: "Database is unavailable",
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use(errorMiddleware);

export default app;