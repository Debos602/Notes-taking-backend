import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AggregationControllers } from "./aggregation.controller";

const router = Router();

router.get("/users/grouped-by-interest", checkAuth(Role.ADMIN), AggregationControllers.groupUsersByInterest);
router.get("/user/stats", checkAuth(Role.USER), AggregationControllers.getUserStats);
router.get("/posts/user/:id", checkAuth(Role.USER, Role.ADMIN), AggregationControllers.getUserPosts);

export const AggregationRoutes = router;
