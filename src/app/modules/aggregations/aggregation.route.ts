import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AggregationControllers } from "./aggregation.controller";

const router = Router();

router.use(checkAuth(Role.ADMIN));

router.get("/users/grouped-by-interest", AggregationControllers.groupUsersByInterest);
router.get("/posts/user/:id", AggregationControllers.getUserPosts);

export const AggregationRoutes = router;
