import express from "express";
import { register, login } from "../../controllers/admin/authController.js";
import {
  createCategory,
  categoryList,
  createSubCategory,
  subCategoryList,
  subCategoryByCategory,
} from "../../controllers/admin/categoryController.js";

const router = express.Router();

router.get("/register", register);
router.post("/login", login);

router.post("/create-category", createCategory);
router.get("/category-list", categoryList);

router.post("/subcategories", createSubCategory);
router.get("/subcategories", subCategoryList);
router.get("/subcategories/category/:category_id", subCategoryByCategory);

export default router;