import z from "zod";

export const createPostZodSchema = z.object({
  title: z
    .string({ invalid_type_error: "Title must be a string" })
    .min(1, { message: "Title is required." })
    .max(200, { message: "Title cannot exceed 200 characters." }),
  content: z
    .string({ invalid_type_error: "Content must be a string" })
    .min(1, { message: "Content is required." })
    .max(5000, { message: "Content cannot exceed 5000 characters." }),
});
