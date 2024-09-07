import { Router } from "express"
import {
    addToCart,
    updateItemQuantity,
    getCart,
    deleteItemFromCart,
    emptyCart 
} from "../controllers/cart.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/addToCart").post(verifyJWT, addToCart)
router.route("/updateItemQuantity").put(verifyJWT, updateItemQuantity)
router.route("/getCart").get(verifyJWT, getCart)
router.route("/deleteItemFromCart").delete(verifyJWT, deleteItemFromCart)
router.route("/emptyCart").delete(verifyJWT, emptyCart)

export default router