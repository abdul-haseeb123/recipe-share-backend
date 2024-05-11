import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = Router();

// secured routes
router.route("/:recipeSlug").post(authMiddleware, createReview);
router.route("/:recipeSlug").put(authMiddleware, updateReview);
router.route("/:recipeSlug").delete(authMiddleware, deleteReview);

export default router;
