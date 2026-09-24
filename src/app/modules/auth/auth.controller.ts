import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const parseExpiresToMs = (value: string) => {
  const match = value.match(/^(\d+)([smhd])/i);

  if (!match) {
    return 24 * 60 * 60 * 1000;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * (multipliers[unit] || 24 * 60 * 60 * 1000);
};

const setAuthCookies = (res: Response, accessToken: string, refreshToken?: string) => {
  const isProduction = envVars.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: parseExpiresToMs(envVars.JWT_ACCESS_EXPIRES),
    path: "/",
  });

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: parseExpiresToMs(envVars.JWT_REFRESH_EXPIRES),
      path: "/",
    });
  }
};

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.register(req.body);

  setAuthCookies(res, result.accessToken, result.refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: {
      user: result.user
    },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);

  setAuthCookies(res, result.accessToken, result.refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: {
      user: result.user
    },
  });
});

const refresh = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = (req.cookies?.refreshToken || req.body.refreshToken) as string;

  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, "Refresh token is required");
  }

  const result = await AuthServices.getNewAccessToken(refreshToken);

  setAuthCookies(res, result.accessToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token refreshed successfully",
    data: result,
  });
});

export const AuthControllers = {
  register,
  login,
  refresh,
};
