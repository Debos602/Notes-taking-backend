import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { PostControllers } from "./post.controller";
import { createPostZodSchema } from "./post.validation";

const router = Router();

router.use(checkAuth(Role.ADMIN, Role.USER));

router.route("/")
  .get(PostControllers.getAllPosts)
  .post(validateRequest(createPostZodSchema), PostControllers.createPost);

export const PostRoutes = router;
