/* eslint-disable no-console */
import mongoose from "mongoose";
import { envVars } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to MongoDB!!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};
