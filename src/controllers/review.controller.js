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

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  if (comment.trim() === "") {
    throw new ApiError(400, "Comment is required");
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
    .status(200)
    .json(new ApiResponse(200, review, "Review created successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
  const { comment, rating, reviewId } = req.body;

  if (!comment || !rating || !reviewId) {
    throw new ApiError(400, "Comment and rating are required");
  }

  if (rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  if (comment.trim() === "") {
    throw new ApiError(400, "Comment is required");
  }

  const review = await Review.findById(reviewId);

  if (!review) throw new ApiError(404, "Review not found");

  review.comment = comment;
  review.rating = rating;

  await review.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, {}, "Review updated successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.body;
  const { recipeSlug } = req.params;

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required");
  }

  const recipe = await Recipe.findOne({ slug: recipeSlug });
  if (!recipe) {
    throw new ApiError(404, "Recipe not found");
  }

  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  await Review.findByIdAndDelete(reviewId);

  const index = recipe.reviews.indexOf(reviewId);
  recipe.reviews.splice(index, 1);
  await recipe.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully"));
});

export { createReview, updateReview, deleteReview };
