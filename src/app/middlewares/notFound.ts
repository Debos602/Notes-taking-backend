import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/AppError";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(httpStatus.NOT_FOUND, `Route ${req.originalUrl} not found`));
};

export default notFound;
