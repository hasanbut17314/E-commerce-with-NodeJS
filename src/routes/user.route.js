import { Router } from "express";
import { 
    registerController, 
    loginController,
    logoutController,
    reCreateAccessToken,
    getUserDetails,
    changeUserDetails,
    changeUserPassword
 } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerController)
router.route("/login").post(loginController)
router.route("/logout").post(verifyJWT, logoutController)
router.route("/recreateAccessToken").post(reCreateAccessToken)
router.route("/getUserDetails").get(verifyJWT, getUserDetails)
router.route("/changeUserDetails").post(verifyJWT, changeUserDetails)
router.route("/changeUserPassword").post(verifyJWT, changeUserPassword)

export default router