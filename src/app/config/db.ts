/* eslint-disable no-console */
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import { envVars } from "./env";
import { Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const ensureSuperAdmin = async (): Promise<void> => {
  const existingAdmin = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL });

  if (existingAdmin) {
    if (existingAdmin.role !== Role.ADMIN) {
      existingAdmin.role = Role.ADMIN;
      await existingAdmin.save();
      console.log(`Super admin role restored for ${existingAdmin.email}`);
    }
    return;
  }

  const hashedPassword = await bcryptjs.hash(
    envVars.SUPER_ADMIN_PASSWORD,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  await User.create({
    name: "Super Admin",
    email: envVars.SUPER_ADMIN_EMAIL,
    password: hashedPassword,
    role: Role.ADMIN,
    interests: [],
  });

  console.log(`Super admin created for ${envVars.SUPER_ADMIN_EMAIL}`);
};

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(envVars.DB_URL);
    await ensureSuperAdmin();
    console.log("Connected to MongoDB!!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};
