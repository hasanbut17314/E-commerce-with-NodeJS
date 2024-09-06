import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { 
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById
 } from "../controllers/category.controller.js";

const router = Router();

router.route("/addCategory").post(upload.single("image"), addCategory);
router.route("/updateCategory/:id").put(upload.single("image"), updateCategory);
router.route("/deleteCategory/:id").delete(deleteCategory);
router.route("/getAllCategories").get(getAllCategories);
router.route("/categoryById/:id").get(getCategoryById);

export default router