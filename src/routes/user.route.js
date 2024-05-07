import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateUserProfile,
  getCurrentUser,
  updateAvatar,
  updateCoverImage,
  deleteUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/change-current-password")
  .put(authMiddleware, changeCurrentPassword);
router.route("/update").put(authMiddleware, updateUserProfile);
router.route("/get-current-user").get(authMiddleware, getCurrentUser);
router
  .route("/update-avatar")
  .put(authMiddleware, upload.single("avatar"), updateAvatar);
router
  .route("/update-cover")
  .put(authMiddleware, upload.single("coverImage"), updateCoverImage);

router.route("/delete").delete(authMiddleware, deleteUserProfile);

export default router;
