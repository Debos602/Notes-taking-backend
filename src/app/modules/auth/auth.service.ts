/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { generateToken } from "../../utils/jwt";
import { IUser, Role } from "../user/user.interface";
import { User } from "../user/user.model";

const generateTokens = (user: IUser) => {
  const jwtPayload: JwtPayload = {
    userId: user._id?.toString() as string,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
  const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

  return { accessToken, refreshToken };
};

const register = async (payload: Partial<IUser>) => {
  const { email, password, name, interests } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "User already exists with this email");
  }

  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    interests: interests || [],
    role: Role.USER,
  });

  const { accessToken, refreshToken } = generateTokens(user);

  const { password: _, ...userObj } = user.toObject();

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};

const login = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const isPasswordMatched = await bcryptjs.compare(password as string, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  const { password: _, ...userObj } = user.toObject();

  return {
    user: userObj,
    accessToken,
    refreshToken,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User no longer exists");
  }

  const jwtPayload = {
    userId: user._id?.toString() as string,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
  return { accessToken };
};

export const AuthServices = {
  register,
  login,
  getNewAccessToken,
};
