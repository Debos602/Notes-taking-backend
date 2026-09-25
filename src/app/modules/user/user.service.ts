/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";

const isValidUserId = (id?: string) => !!id && /^[0-9a-fA-F]{24}$/.test(id);

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  const user = await User.create({
    email,
    password: hashedPassword,
    role: payload.role || Role.USER,
    ...rest,
  });

  const { password: _, ...userObj } = user.toObject();
  return userObj;
};

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);
  const usersQuery = queryBuilder.search(userSearchableFields).filter().sort().paginate();

  const [data, meta] = await Promise.all([usersQuery.build(), queryBuilder.getMeta()]);

  return {
    data: data as any[],
    meta,
  };
};

const getSingleUser = async (id: string) => {
  if (!isValidUserId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const getMe = async (userId: string) => {
  if (!isValidUserId(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>) => {
  if (!isValidUserId(userId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const { password, ...userData } = payload;
  const updateData = password
    ? {
        ...userData,
        password: await bcryptjs.hash(password, Number(envVars.BCRYPT_SALT_ROUND)),
      }
    : userData;

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const deleteUser = async (id: string) => {
  if (!isValidUserId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid user id");
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error("User not found");
  }
  return;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  getMe,
  updateUser,
  deleteUser,
};
