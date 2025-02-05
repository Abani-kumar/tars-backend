import express from "express";
import  {getNote,getNotes,createNote,updateNoteById,deleteNote,favoriteNote,searchNotes} from "../controllers/noteController.js";
import {auth} from "../middlewares/auth.js";
import { rateLimiter } from "../utils/rateLimitter.js";

const router = express.Router();

router.get(
  "/getnotes",
  rateLimiter(3, 1),
  auth,
  getNotes
);
router.get(
  "/getnote/:id",
  rateLimiter(3, 1),
  auth,
  getNote
);
router.post(
  "/createnotes",
  rateLimiter(3, 1),
  auth,
  createNote
);
router.put(
  "/notes/:id",
  rateLimiter(2, 1),
  auth,
  updateNoteById
);
router.delete(
  "/notes/:id",
  rateLimiter(2, 1),
  auth,
  deleteNote
);
router.put(
  "/notes/favorite/:id",
  rateLimiter(2, 1),
  auth,
  favoriteNote
);
router.get(
  "/notes/search",
  rateLimiter(3, 1),
  auth,
  searchNotes
);

export default router;
