import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";
import { 
    addProduct,
    updateProduct,
    getAllProducts,
    productById,
    productByCateId,
    deleteProduct,
    searchProducts
 } from "../controllers/product.controller.js";

const router = Router();

router.route("/addProduct").post(upload.single("image"), addProduct)
router.route("/updateProduct/:id").put(upload.single("image"), updateProduct)
router.route("/getAllProducts").get(getAllProducts)
router.route("/productById/:id").get(productById)
router.route("/productByCateId/:id").get(productByCateId)
router.route("/deleteProduct/:id").delete(deleteProduct)
router.route("/searchProducts").get(searchProducts)

export default router