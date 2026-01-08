import { Router } from "express";
import {
  VCreateCategory,
  VDeleteCategory,
  VGetCategories,
  VGetCategory,
  VUpdateCategoryBody,
  VUpdateCategoryParams,
} from "@shared/validations/category";
import { validate } from "@/middlewares";
import {
  CreateCategory,
  DeleteCategory,
  getCategories,
  GetCategory,
  UpdateCategory,
} from "@/controllers/category";

const CategoryRoute = Router();

CategoryRoute.post("/", validate({ body: VCreateCategory }), CreateCategory);
CategoryRoute.get("/", validate({ query: VGetCategories }), getCategories);
CategoryRoute.get(
  "/:categoryId",
  validate({ params: VGetCategory }),
  GetCategory
);
CategoryRoute.patch(
  "/:categoryId",
  validate({ body: VUpdateCategoryBody, params: VUpdateCategoryParams }),
  UpdateCategory
);
CategoryRoute.delete(
  "/:categoryId",
  validate({ params: VDeleteCategory }),
  DeleteCategory
);

export default CategoryRoute;
