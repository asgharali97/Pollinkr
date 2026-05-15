import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { apiRoutes } from "./routes/index.js";
import { ApiResponse } from "./utils/api-response.js";

export const app = express();

app.use(
  cors({
    origin: env.NODE_ENV === "production" ? env.CLIENT_ORIGIN : true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  return ApiResponse.ok(res, "Pollinkr API is healthy");
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
