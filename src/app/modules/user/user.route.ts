import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "./user.interface";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

router.post("/", checkAuth(Role.ADMIN), validateRequest(createUserZodSchema), UserControllers.createUser);

router.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers);
router.get("/me", checkAuth(Role.ADMIN, Role.USER), UserControllers.getMe);
router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser);
router.patch("/:id", checkAuth(Role.ADMIN), validateRequest(updateUserZodSchema), UserControllers.updateUser);
router.delete("/:id", checkAuth(Role.ADMIN), UserControllers.deleteUser);

export const UserRoutes = router;
