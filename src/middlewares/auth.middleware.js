import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/index.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const authMiddleware = asyncHandler(async (req, _, next) => {
  try {
    const accessToken =
      req.cookies.accessToken ||
      req.headers.authorization.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id).select(
      "-refreshToken -password -recipes"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});
