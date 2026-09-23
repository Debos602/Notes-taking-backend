import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { NoteRoutes } from "../modules/notes/note.route";
import { PostRoutes } from "../modules/posts/post.route";
import { AggregationRoutes } from "../modules/aggregations/aggregation.route";

export const router = Router();

const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/notes", route: NoteRoutes },
  { path: "/posts", route: PostRoutes },
  { path: "/aggregations", route: AggregationRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
