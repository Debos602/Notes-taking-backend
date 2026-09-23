import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PostServices } from "./post.service";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const post = await PostServices.createPost(req.body, decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post created successfully",
    data: post,
  });
});

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  const result = await PostServices.getAllPosts(query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Posts retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

export const PostControllers = {
  createPost,
  getAllPosts,
};
