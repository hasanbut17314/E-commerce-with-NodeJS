import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { addProduct } from "../controllers/product.controller.js";

const router = Router();

router.route("/addProduct").post(upload.single("image"), addProduct)

export default router