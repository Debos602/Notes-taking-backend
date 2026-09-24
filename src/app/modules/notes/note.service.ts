/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { INote } from "./note.interface";
import { Note } from "./note.model";

const isOwnerMatch = (owner: unknown, userId: string) => {
  if (!owner) {
    return false;
  }

  if (typeof owner === "string") {
    return owner === userId;
  }

  if (typeof owner === "object") {
    const ownerObj = owner as { _id?: { toString: () => string } | string; toString?: () => string };
    if (ownerObj._id) {
      return ownerObj._id.toString() === userId;
    }

    if (typeof ownerObj.toString === "function") {
      return ownerObj.toString() === userId;
    }
  }

  return false;
};

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

const getMyNotes = async (query: Record<string, string>, userId: string) => {
  const queryBuilder = new QueryBuilder(
    Note.find({ owner: userId }).populate("owner", "-password"),
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
console.log("Note found:", note); // Debugging log
  if (!note) {
    throw new Error("Note not found");
  }

  if (decodedToken.role === "USER" && !isOwnerMatch(note.owner, decodedToken.userId)) {
    throw new Error("You are not authorized to view this note");
  }

  return note;
};

const updateNote = async (noteId: string, payload: Partial<INote>, decodedToken: JwtPayload) => {
  const note = await Note.findById(noteId);

  if (!note) {
    throw new Error("Note not found");
  }

  if (decodedToken.role === "USER" && !isOwnerMatch(note.owner, decodedToken.userId)) {
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

  if (decodedToken.role === "USER" && !isOwnerMatch(note.owner, decodedToken.userId)) {
    throw new Error("You are not authorized to delete this note");
  }

  await Note.findByIdAndDelete(noteId);
  return;
};

export const NoteServices = {
  createNote,
  getAllNotes,
  getMyNotes,
  getSingleNote,
  updateNote,
  deleteNote,
};
