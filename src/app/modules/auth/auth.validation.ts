import z from "zod";

export const registerZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .email({ message: "Invalid email address format." }),
  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least 1 uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least 1 lowercase letter." })
    .regex(/\d/, { message: "Password must contain at least 1 number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least 1 special character." }),
  interests: z.array(z.string()).default([]),
});

export const loginZodSchema = z.object({
  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .email({ message: "Invalid email address format." }),
  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .min(1, { message: "Password is required." }),
});
