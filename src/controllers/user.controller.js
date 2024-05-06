import { asyncHandler } from "../utils/index.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;
  // check if all fields are provided
  if (!firstName || !lastName || !email || !username || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if (
    [firstName, lastName, email, username, password].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  // console.log("Files", req.files);
  // console.log(req.files["avatar"]);
  // console.log(req.files["coverImage"]);

  const avatarLocalFilePath = req.files["avatar"]
    ? req?.files["avatar"][0]?.path
    : null;
  const coverImageLocalFilePath = req.files["coverImage"]
    ? req?.files["coverImage"][0]?.path
    : null;

  console.log("Avatar", avatarLocalFilePath);

  if (!avatarLocalFilePath || avatarLocalFilePath == undefined) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalFilePath);
  const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    username,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const user = await User.findOne({ _id: createdUser._id }).select("-password");
  if (!user) {
    throw new ApiError(500, "User not found");
  }

  res
    .status(201)
    .json(new ApiResponse(200, user, "User registered successfully"));
});

export { registerUser };
