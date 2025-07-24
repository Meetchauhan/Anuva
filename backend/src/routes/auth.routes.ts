import express from "express";

const router = express.Router();
import { getUser, login, signup } from "../controllers/auth.controller";
import { protect } from "../middlewares/authMiddleware";

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", protect, getUser);
export default router;