import express from "express";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./config/openapi";
import { healthRouter } from "./routes/health.routes";

// Configures the app; server.ts starts it. Kept apart so tests can import `app` without opening a port.
export const app = express();

app.use(express.json());

app.use("/api/health", healthRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
