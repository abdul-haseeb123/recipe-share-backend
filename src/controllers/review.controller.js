import { asyncHandler } from "../utils/index.js";
import { Review } from "../models/review.model.js";
import { Recipe } from "../models/recipe.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createReview = asyncHandler(async (req, res) => {
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    throw new ApiError(400, "Comment and rating are required");
  }

  const { recipeSlug } = req.params;
  const recipe = await Recipe.findOne({ slug: recipeSlug });
  if (!recipe) {
    throw new ApiError(404, "Recipe not found");
  }

  recipe.reviews.push(recipe._id);

  await recipe.save({ validateBeforeSave: false });

  const { _id: userId } = req.user;

  const review = await Review.create({
    user: userId,
    recipe: recipe._id,
    comment,
    rating,
  });

  await review.save();

  res
    .status(201)
    .json(new ApiResponse(201, review, "Review created successfully"));
});

export { createReview };
