import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: user,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await UserServices.getAllUsers(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserServices.getSingleUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: user,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const user = await UserServices.getMe(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await UserServices.updateUser(id, req.body);
 
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: user,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await UserServices.deleteUser(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: null,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  getMe,
  updateUser,
  deleteUser,
};
