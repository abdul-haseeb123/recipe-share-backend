import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createRecipe,
  getRecipeBySlug,
  getRecipes,
  getRecipesOfCurrentUser,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getRecipes);
router.route("/:slug").get(getRecipeBySlug);

// secured routes
router.route("/").post(
  authMiddleware,
  upload.fields([
    {
      name: "recipeImages",
      maxCount: 5,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  createRecipe
);
router.route("/:slug").put(authMiddleware, updateRecipe);
router.route("/:slug").delete(authMiddleware, deleteRecipe);
router.route("/current-user").get(authMiddleware, getRecipesOfCurrentUser);

export default router;
