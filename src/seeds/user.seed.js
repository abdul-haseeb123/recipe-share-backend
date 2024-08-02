import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Recipe } from "../models/recipe.model.js";
import { asyncHandler } from "../utils/index.js";
import { User } from "../models/user.model.js";
import { faker } from "@faker-js/faker";
import { USERS_COUNT } from "../constants.js";
import { loadJson } from "../utils/index.js";

const filePath = "src/seeds/user-images.json";

const seedUsers = asyncHandler(async (req, res) => {
  await User.deleteMany();
  await Review.deleteMany();
  await Recipe.deleteMany();
  const userImages = loadJson(filePath);

  const users = new Array(USERS_COUNT).fill("_").map(() => {
    const email = faker.internet.email();
    const username = email.split("@")[0];
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email,
      username,
      password: username.toLowerCase(), // NOTE: IF YOU DO NOT CONVERT PASSWORD TO LOWERCASE HERE, IT WOULD CAPITALIZE EACH WORD OF THE PASSWORD
      avatar: faker.helpers.arrayElement(userImages),
      coverImage: null,
    };
  });

  users.forEach(async (user) => {
    await User.create(user);
  });
  res.status(200).json(new ApiResponse(200, null, "Users seeded"));
});

export { seedUsers };
