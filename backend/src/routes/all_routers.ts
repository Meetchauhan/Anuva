import authRoutes from "./auth.routes.js";

import { Router } from "express";

const router = Router();

router.use("/auth", authRoutes);

export default router;