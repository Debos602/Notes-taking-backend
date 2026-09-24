import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();
    const token = bearer || req.cookies?.accessToken;

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "No token received");
    }

    const verifiedToken = verifyToken(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;

    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not permitted to access this route");
    }

    req.user = verifiedToken;
    next();
  } catch (error) {
    next(error);
  }
};