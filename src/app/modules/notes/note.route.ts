import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { NoteControllers } from "./note.controller";
import { createNoteZodSchema, updateNoteZodSchema } from "./note.validation";

const router = Router();

router.use(checkAuth(Role.ADMIN, Role.USER));

router.route("/")
  .get(NoteControllers.getAllNotes)
  .post(validateRequest(createNoteZodSchema), NoteControllers.createNote);

router.get("/my-notes", NoteControllers.getMyNotes);

router.route("/:id")
  .get(NoteControllers.getSingleNote)
  .patch(validateRequest(updateNoteZodSchema), NoteControllers.updateNote)
  .delete(NoteControllers.deleteNote);

export const NoteRoutes = router;
