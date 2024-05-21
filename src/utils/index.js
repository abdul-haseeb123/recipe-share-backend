import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

export const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch((err) => next(err));
  };
};

export const generateSlug = (title) => {
  const uniqueSlug = `${slugify(title, { lower: true, strict: true })}-${uuidv4()}`;
  return uniqueSlug;
};

export const loadJson = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const foodImages = JSON.parse(data);
    return foodImages;
  } catch (error) {
    console.error("Error loading food-images.json:", error);
    return null;
  }
};
