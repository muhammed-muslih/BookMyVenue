import PinoHttp from "pino-http";
import { logger } from "@config/logger";

export const httpLogger = PinoHttp({
  logger,

  customLogLevel: (_req, res, _err) => {
    if (res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  customSuccessMessage: (req, res) =>
    `${req.method} ${req.url} - ${res.statusCode}`,

  customErrorMessage: (req, res, _err) =>
    `${req.method} ${req.url} - ERROR ${res.statusCode}`,

  customProps: (req, res) => ({
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
  }),

  serializers: {
    req: () => undefined,
    res: () => undefined,
  },
});
