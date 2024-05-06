import { asyncHandler } from "../utils/index.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};

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

  const avatarLocalFilePath = req.files["avatar"]
    ? req?.files["avatar"][0]?.path
    : null;
  const coverImageLocalFilePath = req.files["coverImage"]
    ? req?.files["coverImage"][0]?.path
    : null;

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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isPasswordCorrect = await existedUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid email or password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    existedUser._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  const user = await User.findById(existedUser._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export { registerUser, loginUser, logoutUser };
