import { Router } from "express";
import {
    createOrder,
    getOrder,
    updateOrderStatus,
    deleteOrder,
    getAllOrders,
    stripePayment
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/createOrder").post(verifyJWT, createOrder);
router.route("/getOrder").get(verifyJWT, getOrder);
router.route("/updateOrderStatus").post(updateOrderStatus);
router.route("/deleteOrder").post(deleteOrder);
router.route("/getAllOrders").get(getAllOrders);
router.route("/stripePayment").post(stripePayment);

export default router