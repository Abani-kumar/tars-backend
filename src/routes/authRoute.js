import express from "express";
import  { register,login }  from "../controllers/authController.js";
import { rateLimiter } from "../utils/rateLimitter.js";

const router = express.Router();

router.post("/register",rateLimiter(2,1), register);
router.post("/login",rateLimiter(2,1), login);

export default router;
