import { asyncHandler, generateSlug } from "../utils/index.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Recipe } from "../models/recipe.model.js";
import { Review } from "../models/review.model.js";
import { CATEGORIES } from "../constants.js";

// CAUTION ANY DELETING AND UPDATING OF ASSETS DOES NOT REMOVE THE ASSETS FROM THE CLOUDINARY SERVER

const createRecipe = asyncHandler(async (req, res) => {
  const { title, category, description, ingredients, instructions } = req.body;

  if (!title || !category || !description || !instructions || !ingredients) {
    throw new ApiError(400, "All fields are required");
  }

  if (
    [title, category, description, instructions, ingredients].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!CATEGORIES.includes(category)) {
    throw new ApiError(400, "Invalid category");
  }

  const recipeImagesLocalFilePaths = req.files["recipeImages"]
    ? req?.files["recipeImages"]
    : null;

  const recipeCoverImageFilePath = req.files["coverImage"]
    ? req.files["coverImage"][0]?.path
    : null;

  if (!recipeCoverImageFilePath || recipeCoverImageFilePath == undefined) {
    throw new ApiError(400, "Cover image is required");
  }

  if (
    !recipeImagesLocalFilePaths ||
    recipeImagesLocalFilePaths == undefined ||
    recipeImagesLocalFilePaths.length < 1
  ) {
    throw new ApiError(400, "At least 1 Recipe image is required");
  }

  const coverImage = await uploadOnCloudinary(recipeCoverImageFilePath);

  if (!coverImage) {
    throw new ApiError(500, "Cover image upload failed");
  }
  const recipeImages = [];
  for (const image of recipeImagesLocalFilePaths) {
    const uploadedImage = await uploadOnCloudinary(image.path);
    if (!uploadedImage) {
      throw new ApiError(500, "Recipe image upload failed");
    }
    recipeImages.push(uploadedImage);
  }

  const slug = generateSlug(title);

  const newRecipe = await Recipe.create({
    title,
    slug,
    category,
    description,
    ingredients,
    instructions,
    images: recipeImages,
    coverImage: coverImage,
    owner: req.user._id,
  });

  const user = await User.findById(req.user._id);
  user.recipes.push(newRecipe._id);
  await user.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, newRecipe, "recipe created successfully"));
});

const getRecipeBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    throw new ApiError(400, "Slug is required");
  }

  const recipe = await Recipe.aggregate([
    { $match: { slug } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "recipe",
        as: "reviews",
      },
    },
    {
      $addFields: {
        rating: { $ifNull: [{ $avg: "$reviews.rating" }, 1] },
      },
    },
    {
      $project: {
        title: 1,
        category: 1,
        description: 1,
        ingredients: 1,
        instructions: 1,
        images: 1,
        coverImage: 1,
        owner: { $arrayElemAt: ["$owner.username", 0] },
        rating: { $round: ["$rating", 1] },
        reviews: 1,
      },
    },
  ]);
  if (!recipe) {
    throw new ApiError(404, "Recipe not found");
  }
  res.status(200).json(new ApiResponse(200, recipe[0], "Recipe retrieved"));
});

const getRecipes = asyncHandler(async (req, res) => {
  const { category } = req.query;

  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "recipe",
        as: "reviews",
      },
    },
    {
      $addFields: {
        rating: {
          $ifNull: [{ $avg: "$reviews.rating" }, 1],
        },
      },
    },
    {
      $sort: { rating: -1 },
    },
    {
      $project: {
        title: 1,
        category: 1,
        coverImage: 1,
        owner: { $arrayElemAt: ["$owner.username", 0] },
        rating: { $round: ["$rating", 1] },
      },
    },
  ];

  if (category) pipeline.unshift({ $match: { category } });

  const recipes = await Recipe.aggregate(pipeline);

  res.status(200).json(new ApiResponse(200, recipes, "Recipes retrieved"));
});

const getRecipesOfCurrentUser = asyncHandler(async (req, res) => {
  const pipeline = [
    {
      $match: { owner: req.user._id },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "reviews",
        foreignField: "recipe",
        as: "reviews",
      },
    },
    {
      $addFields: {
        rating: {
          $ifNull: [{ $avg: "$reviews.rating" }, 1],
        },
      },
    },
    {
      $sort: { rating: -1 },
    },
    {
      $project: {
        title: 1,
        category: 1,
        coverImage: 1,
        owner: { $arrayElemAt: ["$owner.username", 0] },
        rating: { $round: ["$rating", 1] },
      },
    },
  ];
  const recipes = await Recipe.aggregate(pipeline);

  if (!recipes) {
    throw new ApiError(404, "Recipes not found");
  }

  res.status(200).json(new ApiResponse(200, recipes, "Recipes retrieved"));
});

const updateRecipe = asyncHandler(async (req, res) => {
  const { title, category, description, ingredients, instructions } = req.body;
  const { slug } = req.params;

  if (!title && !category && !description && !ingredients && !instructions) {
    throw new ApiError(400, "At least one field is required");
  }

  if (
    [title, category, description, instructions, ingredients]
      .filter((field) => field !== undefined)
      .some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const updatedFields = {};
  if (title) {
    updatedFields.title = title;
  }
  if (category) {
    updatedFields.category = category;
  }
  if (description) {
    updatedFields.description = description;
  }
  if (ingredients) {
    updatedFields.ingredients = ingredients;
  }
  if (instructions) {
    updatedFields.instructions = instructions;
  }

  const updatedRecipe = await Recipe.findOneAndUpdate(
    { slug },
    { $set: updatedFields },
    { new: true }
  );

  if (!updatedRecipe) {
    throw new ApiError(404, "Recipe not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedRecipe, "Recipe updated successfully"));
});

const deleteRecipe = asyncHandler(async (req, res) => {
  const { slug } = req.body;

  if (!slug) {
    throw new ApiError(400, "Slug is required");
  }

  const recipe = await Recipe.findOne({ slug });
  if (!recipe) {
    throw new ApiError(404, "Recipe not found");
  }
  await Review.deleteMany({ recipe: recipe._id });

  const user = await User.findById(req.user._id);
  user.recipes = user.recipes.filter((recipeId) => recipeId != recipe._id);
  await user.save({ validateBeforeSave: false });
  await recipe.deleteOne({ slug, owner: req.user._id });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Recipe deleted successfully"));
});

export {
  createRecipe,
  getRecipeBySlug,
  getRecipes,
  getRecipesOfCurrentUser,
  updateRecipe,
  deleteRecipe,
};
