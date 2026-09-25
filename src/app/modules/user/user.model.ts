import { model, Schema } from "mongoose";
import { IUser, Role } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    interests: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ interests: 1 });
userSchema.index({ createdAt: -1 });


export const User = model<IUser>("User", userSchema);
