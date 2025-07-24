import * as express from "express";
const router = express.Router();
import { getUser, login, signup } from "../controllers/auth.controller.js";
import { is_logged_in } from "../middlewares/authMiddleware.js";

router.post("/signup", signup); 
router.post("/login", login);
router.get("/user", is_logged_in, getUser);
export default router;