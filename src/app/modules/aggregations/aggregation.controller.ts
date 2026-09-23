/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { Types } from "mongoose";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
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

const getUserPosts = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const userWithPosts = await User.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "author",
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

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User posts retrieved successfully",
    data: userWithPosts[0],
  });
});

export const AggregationControllers = {
  groupUsersByInterest,
  getUserPosts,
};
