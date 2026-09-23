/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { INote } from "./note.interface";
import { Note } from "./note.model";

const createNote = async (payload: Partial<INote>, userId: string) => {
  const note = await Note.create({
    ...payload,
    owner: userId,
  });
  return note;
};

const getAllNotes = async (query: Record<string, string>, decodedToken: JwtPayload) => {
  let ownerFilter: any = {};

  if (decodedToken.role === "USER") {
    ownerFilter = { owner: decodedToken.userId };
  }

  const queryBuilder = new QueryBuilder(
    Note.find(ownerFilter).populate("owner", "-password"),
    query
  );
  const notesQuery = queryBuilder.sort().paginate();

  const [data, meta] = await Promise.all([notesQuery.build(), queryBuilder.getMeta()]);

  return {
    data,
    meta,
  };
};

const getSingleNote = async (noteId: string, decodedToken: JwtPayload) => {
  const note = await Note.findById(noteId).populate("owner", "-password");

  if (!note) {
    throw new Error("Note not found");
  }

  if (decodedToken.role === "USER" && (note.owner as any).toString() !== decodedToken.userId) {
    throw new Error("You are not authorized to view this note");
  }

  return note;
};

const updateNote = async (noteId: string, payload: Partial<INote>, decodedToken: JwtPayload) => {
  const note = await Note.findById(noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  if (decodedToken.role === "USER" && note.owner.toString() !== decodedToken.userId) {
    throw new Error("You are not authorized to update this note");
  }

  const updatedNote = await Note.findByIdAndUpdate(noteId, payload, {
    new: true,
    runValidators: true,
  }).populate("owner", "-password");

  return updatedNote;
};

const deleteNote = async (noteId: string, decodedToken: JwtPayload) => {
  const note = await Note.findById(noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  if (decodedToken.role === "USER" && note.owner.toString() !== decodedToken.userId) {
    throw new Error("You are not authorized to delete this note");
  }

  await Note.findByIdAndDelete(noteId);
  return;
};

export const NoteServices = {
  createNote,
  getAllNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
