import express from "express";
import errorMiddleware from "./middleware/error.middleware.js";
import loggerMiddleware from "./middleware/logger.middleware.js";

const app = express();

app.use(loggerMiddleware);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "SchoolPulse backend is running",
  });
});

app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use(errorMiddleware);

export default app;