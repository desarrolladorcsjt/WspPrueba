import "./bootstrap";
import "reflect-metadata";
import "express-async-errors";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/node";

import "./database";
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";
import routes from "./routes";
import { logger } from "./utils/logger";

Sentry.init({ dsn: process.env.SENTRY_DSN });

const app = express();
 
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin); // ← Devuelve el mismo origin que hace la petición
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  })
);
app.options("*", cors());


// app.use(
//   cors({
//     credentials: false,
//     // origin: process.env.FRONTEND_URL
//     origin: function (origin, callback) {
//       // Si no hay origen (como en solicitudes desde el mismo dominio) o el origen está permitido
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('No permitido por CORS'));
//       }
//     } 
//   })
// );
// app.use(
//   cors({
//     credentials: true,
//     origin: process.env.FRONTEND_URL
//   })
// );

app.use(cookieParser());
app.use(express.json());
app.use(Sentry.Handlers.requestHandler());
app.use("/public", express.static(uploadConfig.directory));
app.use(routes);

app.use(Sentry.Handlers.errorHandler());

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(err);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

export default app;
