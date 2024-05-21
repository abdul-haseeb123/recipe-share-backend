import { faker } from "@faker-js/faker";
import { asyncHandler } from "../utils/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Recipe } from "../models/recipe.model.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { REVIEWS_COUNT } from "../constants.js";

const seedReviews = asyncHandler(async (req, res) => {
  await Review.deleteMany();
  await Recipe.updateMany({}, { reviews: [] });
  const recipes = await Recipe.find();
  const users = await User.find();
  if (recipes.length === 0) {
    throw new ApiError(404, "No recipes found.");
  }
  if (users.length === 0) {
    throw new ApiError(404, "No users found.");
  }

  const reviews = new Array(REVIEWS_COUNT).fill("_").map(() => {
    const user = faker.helpers.arrayElement(users);
    const recipe = faker.helpers.arrayElement(recipes);
    const rating = faker.number.int({ min: 1, max: 5 });
    return {
      recipe: recipe._id,
      user: user._id,
      rating,
      comment: faker.lorem.sentences({ min: 1, max: 4 }),
    };
  });

  const insertedReviews = await Review.insertMany(reviews);
  insertedReviews.forEach(async (review) => {
    const recipe = await Recipe.findById(review.recipe);
    recipe.reviews.push(recipe._id);
    await recipe.save({ validateBeforeSave: false });
  });
  res.status(201).json(new ApiResponse(200, null, "Reviews seeded"));
});

export { seedReviews };
