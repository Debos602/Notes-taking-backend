import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Secure Note-Taking Application API",
  });
});

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
