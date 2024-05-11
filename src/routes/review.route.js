import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createReview } from "../controllers/review.controller.js";

const router = Router();

// secured routes
router.route("/:recipeSlug").post(authMiddleware, createReview);

export default router;
