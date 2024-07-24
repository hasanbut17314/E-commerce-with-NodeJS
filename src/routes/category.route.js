import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { addCategory } from "../controllers/category.controller.js";

const router = Router();

router.route("/addCategory").post(upload.single("image"), addCategory);

export default router