import { Router } from "express"
import {
    addToCart,
    updateItemQuantity,
    getCart,
    deleteItemFromCart,
    emptyCart 
} from "../controllers/cart.controller.js"

const router = Router()

router.route("/addToCart").post(addToCart)
router.route("/updateItemQuantity").post(updateItemQuantity)
router.route("/getCart").get(getCart)
router.route("/deleteItemFromCart").post(deleteItemFromCart)
router.route("/emptyCart").post(emptyCart)

export default router