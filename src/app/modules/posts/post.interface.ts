import { Types } from "mongoose";

export interface IPost {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  author: Types.ObjectId;
  createdAt?: Date;
}
