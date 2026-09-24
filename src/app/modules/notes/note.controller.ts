import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { NoteServices } from "./note.service";

const createNote = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const note = await NoteServices.createNote(req.body, decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Note created successfully",
    data: note,
  });
});

const getAllNotes = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const query = req.query as Record<string, string>;
  const result = await NoteServices.getAllNotes(query, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Notes retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getMyNotes = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const query = req.query as Record<string, string>;
  const result = await NoteServices.getMyNotes(query, decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your notes retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleNote = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const note = await NoteServices.getSingleNote(req.params.id, decodedToken);

  console.log("Retrieved note:", note, decodedToken); // Debugging log

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Note retrieved successfully",
    data: note,
  });
});

const updateNote = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const note = await NoteServices.updateNote(req.params.id, req.body, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Note updated successfully",
    data: note,
  });
});

const deleteNote = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  await NoteServices.deleteNote(req.params.id, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Note deleted successfully",
    data: null,
  });
});

export const NoteControllers = {
  createNote,
  getAllNotes,
  getMyNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
