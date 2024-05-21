import { Router } from "express";
import { seedRecipes } from "../seeds/recipe.seed.js";
import { seedReviews } from "../seeds/review.seed.js";
import { seedUsers } from "../seeds/user.seed.js";

const router = Router();

router.route("/recipes").post(seedRecipes);
router.route("/reviews").post(seedReviews);
router.route("/users").post(seedUsers);

export default router;
