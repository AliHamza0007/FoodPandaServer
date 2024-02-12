import express from "express";
import formidableMiddleware from "express-formidable";
import {
  createProductController,
  deleteProductController,
  getProductController,
  singleProductController,
  updateProductController,
  photoProductController,
  filterProductController,
  countProductController,
  pageProductController,
  searchProductController,
  relatedProductController,
  categoryWiseProductController,
  singleProduct
} from "../controllers/productsController.js";
import { isAdmin, tokenRequire } from "../middlewares/authMiddleware.js";

const router = express.Router();

///    Add product api
router.post(
  "/create-product",
  tokenRequire,
  isAdmin,
  formidableMiddleware(),
  createProductController
);

///  Update product api
router.put(
  "/update-product/:id",
  tokenRequire,
  isAdmin,
  formidableMiddleware(),
  updateProductController
);

///  filter product
router.post("/filter-product", filterProductController);
////    get product All
router.get("/get-product", getProductController);
///         photo get product
router.get("/photo-product/:pid", photoProductController);
///       get single product
router.get("/single-product/:slug", singleProductController);
//by id 
router.get("/product/:id", singleProduct);
///    get total count of product
router.get("/count-product", countProductController);
//        gte product per page    10 products at  a time
router.get("/page-product/:page", pageProductController);
//search Base product
router.get("/search-product/:keyword", searchProductController);
//similar  product
router.get("/related-product/:pid/:cid", relatedProductController);

///delete product
router.delete(
  "/delete-product/:id",
    tokenRequire,
    isAdmin,
  deleteProductController
);

//category wise product showing

router.get("/category-wiseproduct/:slug", categoryWiseProductController);
//place order details
export default router;
