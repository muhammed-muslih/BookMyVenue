import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import PinoHttp from "pino-http";

import { logger } from "./config/logger";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { globalErrorHandler } from "./middleware/error.middleware";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(PinoHttp({ logger }));

app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
