import mongoose from "mongoose";
import { CATEGORIES } from "../config";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
      },
    ],
    instructions: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Recipe = mongoose.model("Recipe", recipeSchema);
