import { Router } from "express";
import {
    createOrder,
    getOrder,
    updateOrderStatus,
    deleteOrder
} from "../controllers/order.controller.js";

const router = Router();

router.route("/createOrder").post(createOrder);
router.route("/getOrder").get(getOrder);
router.route("/updateOrderStatus").post(updateOrderStatus);
router.route("/deleteOrder").post(deleteOrder);

export default router