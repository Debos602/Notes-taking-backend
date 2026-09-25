/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Note } from "../notes/note.model";
import { Post } from "../posts/post.model";
import { User } from "../user/user.model";

const groupUsersByInterest = catchAsync(async (req: Request, res: Response) => {
  const groupedUsers = await User.aggregate([
    { $unwind: "$interests" },
    {
      $group: {
        _id: "$interests",
        users: {
          $push: {
            _id: { $toString: "$_id" },
            name: "$name",
            email: "$email",
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const result = groupedUsers.map((g: any) => ({
    interest: g._id,
    users: g.users,
  }));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users grouped by interests",
    data: result,
  });
});

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const userId = decodedToken.userId;

  const [postCount, noteCount, user] = await Promise.all([
    Post.countDocuments({ author: userId }),
    Note.countDocuments({ owner: userId }),
    User.findById(userId).select("interests").lean(),
  ]);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User stats retrieved successfully",
    data: {
      postCount,
      noteCount,
      interestCount: user?.interests?.length ?? 0,
    },
  });
});

const getUserPosts = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const decodedToken = req.user as JwtPayload;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.max(Number(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  if (decodedToken.role === "USER" && decodedToken.userId !== id) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to view other user's posts");
  }

  const userWithPosts = await User.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $lookup: {
        from: "posts",
        let: { userId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$author", "$$userId"] } } },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ],
        as: "posts",
      },
    },
    {
      $project: {
        password: 0,
      },
    },
  ]);

  if (!userWithPosts || userWithPosts.length === 0) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NOT_FOUND,
      message: "User not found",
      data: null,
    });
    return;
  }

  const total = await Post.countDocuments({ author: id });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User posts retrieved successfully",
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: userWithPosts[0],
  });
});

export const AggregationControllers = {
  groupUsersByInterest,
  getUserStats,
  getUserPosts,
};
