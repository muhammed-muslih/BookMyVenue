import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";

import { httpLogger } from "@config/httpLogger";
import { notFoundHandler } from "@middlewares/not-found.middleware";
import { globalErrorHandler } from "@middlewares/error.middleware";
import authRoutes from "@routes/auth.route";
import venueRoutes from "@/routes/venue.routes";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use(httpLogger);

//routes
app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);

// 404 handler
app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;
