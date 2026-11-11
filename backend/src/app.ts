import express from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { openapiSpec } from "./config/openapi";
import { healthRouter } from "./routes/health.routes";
import { authRouter } from "./routes/auth.routes";
import { meRouter } from "./routes/me.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/me", meRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use(errorHandler);
