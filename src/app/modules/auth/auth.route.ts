import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { loginZodSchema, registerZodSchema } from "./auth.validation";

const router = Router();

router.post("/register", validateRequest(registerZodSchema), AuthControllers.register);
router.post("/login", validateRequest(loginZodSchema), AuthControllers.login);
router.post("/refresh", AuthControllers.refresh);
router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;
