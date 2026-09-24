import { model, Schema } from "mongoose";
import { INote } from "./note.interface";

const noteSchema = new Schema<INote>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true, versionKey: false }
);

noteSchema.index({ owner: 1, createdAt: -1 });
noteSchema.index({ createdAt: -1 });

export const Note = model<INote>("Note", noteSchema);
