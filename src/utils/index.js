import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

export const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch((err) => next(err));
  };
};

export const generateSlug = (title) => {
  const uniqueSlug = `${slugify(title, { lower: true, strict: true })}-${uuidv4()}`;
  return uniqueSlug;
};
