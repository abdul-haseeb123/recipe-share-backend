import fs from "fs";
import { CATEGORIES, RECIPES_COUNT } from "../constants.js";
import { asyncHandler } from "../utils/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Recipe } from "../models/recipe.model.js";
import { User } from "../models/user.model.js";
import { Review } from "../models/review.model.js";
import { faker } from "@faker-js/faker";
import { generateSlug } from "../utils/index.js";

const filePath = "src/seeds/food-images.json";

const loadFoodImages = () => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const foodImages = JSON.parse(data);
    return foodImages;
  } catch (error) {
    console.error("Error loading food-images.json:", error);
    return null;
  }
};

const recipes = new Array(RECIPES_COUNT).fill("_").map(() => {
  const title = faker.lorem.words({ min: 2, max: 5 });
  const category = faker.helpers.arrayElement(CATEGORIES);
  const description = faker.lorem.sentences({ min: 4, max: 10 });
  const instructions = faker.lorem.sentences({ min: 4, max: 12 });
  const ingredients = faker.lorem.words({ min: 1, max: 16 });
  const slug = generateSlug(title);
  return {
    title,
    category,
    description,
    instructions,
    ingredients,
    slug,
  };
});

const seedRecipes = asyncHandler(async (req, res) => {
  await Recipe.deleteMany();
  await Review.deleteMany();
  await User.updateMany({}, { recipes: [] });
  const foodImages = loadFoodImages();
  const users = await User.find();
  if (users.length === 0) {
    throw new ApiError(404, "No users found.");
  }
  res.status(200).json(new ApiResponse(200, recipes, "Seeding recipes..."));
});

export { seedRecipes };
