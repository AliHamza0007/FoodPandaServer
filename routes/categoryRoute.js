import express from "express";
import { tokenRequire, isAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();
import {
  updateCategoryController,
  deleteCategoryController,
  createCategoryController,
  getCategoryController,
  singleCategoryController,
} from "../controllers/categoryController.js";

router.post(
  "/create-category",
  // tokenRequire,
  // isAdmin,
  createCategoryController
);

router.put(
  "/update-category/:id",
  tokenRequire,
  isAdmin,
  updateCategoryController
);

router.get("/get-category", getCategoryController);

router.get("/single-category/:id", singleCategoryController);
router.delete(
  "/delete-category/:id",
  tokenRequire,
  isAdmin,
  deleteCategoryController
);
export default router;
