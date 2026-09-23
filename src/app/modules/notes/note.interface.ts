import { Types } from "mongoose";

export interface INote {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  owner: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
