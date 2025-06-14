import { asyncHandler } from "../utils/asyncHandler.js";
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
    throw new ApiError(
      500,
      "something went wrong while generating access and refresh token."
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty (could be done in frontend also)
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload images to cloudinary, check if avatar is uploaded or not
  // create User Object in DataBase
  // check if User created
  // remove "password" and "refreshToken" field from response
  // return response

  // get User details
  const { username, email, fullName, password } = req.body;

  // validation - not empty
  /*
    if (username === "") {
      throw new ApiError(400, "username id required");
    }else if{

    }
  */

  // advanced validation - not empty
  if (
    [username, email, fullName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user already exists: username, email
  const existedUser = await User.findOne({ $or: [{ email }, { username }] }); // operator using "$" dollar sign
  if (existedUser) {
    throw new ApiError(409, "User with same email or username already exists");
  }

  // check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    // check for avatar
    throw new ApiError(400, "Avatar image is required.");
  }

  // console.log("req.files: ", req.files);
  // console.log("req.files.avatar: ", req.files.avatar);

  // upload images to cloudinary, check if avatar is uploaded or not
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // console.log("cloudinary avatar: ", avatar);
  // console.log("cloudinary coverImage: ", coverImage);

  if (!avatar) {
    throw new ApiError(400, "Avatar image is required.");
  }

  // create User Object in DataBase
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // console.log("user: ", user);

  // check if User created && remove "password" and "refreshToken" field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // remove password and refreshToken field using ".select" // weird syntax:- as it receives multiple fields in one string with spaces in between, without receiving fields as an object.
  );

  // console.log("createdUser: ", createdUser);

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));

  // assignment:- check console.log() of "req.files" "req.files.avatar" "avatar" and more
});

const loginUser = asyncHandler(async (req, res) => {
  // get username, email, password from req.body
  // check for username && email
  // find the User by username or email
  // check pasword
  // generate Access Token and Refresh token
  // send cookie as response (secure cookie with options)

  const { username, email, password } = req.body;

  if (!username && !email) {
    // if(!(username || email)){} // alternate method
    throw new ApiError(400, "username and email is required.");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user Credentials.");
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    // secure cookie options
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully."
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 }, // this removes the field from document
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out."));
});

export { registerUser, loginUser, logoutUser };
