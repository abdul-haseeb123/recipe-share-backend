import { Router } from "express";
import { seedRecipes } from "../seeds/recipe.seed.js";

const router = Router();

router.route("/recipes").post(seedRecipes);

export default router;
