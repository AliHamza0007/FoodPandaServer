import express from "express";
import {
  userRegisterController,
  userLoginController,
  tokenRequireController,
  forgotPasswordController,
  userUpdateController,
  getAllUsers,
  getSingleUsers,
  searchUsers,
  deleteUser,
  otpRequestController,
  userPasswordUpdateController,
} from "../controllers/authController.js";
import { isAdmin, tokenRequire } from "../middlewares/authMiddleware.js";
const router = express.Router();

//routing
//method post
router.post("/register", userRegisterController);
router.post("/login", userLoginController);
router.post("/otp-request",otpRequestController);
router.post("/forgot-password", forgotPasswordController);
router.put("/user-update/:id", tokenRequire, userUpdateController);
router.put("/user-password-update/:id", tokenRequire,userPasswordUpdateController);

router.get("/tokenTest", tokenRequire, isAdmin, tokenRequireController);

//user authentication
router.get("/user-auth", tokenRequire, (req, res) => {
  res.status(200).send({ ok: true });
});
//admin authentication
router.get("/admin-auth", tokenRequire, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/get-users", tokenRequire, getAllUsers);
router.get("/search-user/:keyword", tokenRequire, searchUsers);
router.get("/single-user/:id", tokenRequire, getSingleUsers);
router.delete("/delete-user/:id", tokenRequire, deleteUser);
export default router;
