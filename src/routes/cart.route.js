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
router.route("/updateItemQuantity").post(verifyJWT, updateItemQuantity)
router.route("/getCart").get(verifyJWT, getCart)
router.route("/deleteItemFromCart").post(verifyJWT, deleteItemFromCart)
router.route("/emptyCart").post(verifyJWT, emptyCart)

export default router