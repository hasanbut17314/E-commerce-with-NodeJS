import { Router } from "express";
import { 
    registerController, 
    loginController,
    logoutController,
    reCreateAccessToken,
    getUserDetails,
    changeUserDetails,
    changeUserPassword,
    getAllUsers,
    deleteUser,
    changeUserRole
 } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerController)
router.route("/login").post(loginController)
router.route("/logout").post(verifyJWT, logoutController)
router.route("/recreateAccessToken").post(reCreateAccessToken)
router.route("/getUserDetails").get(verifyJWT, getUserDetails)
router.route("/changeUserDetails").put(verifyJWT, changeUserDetails)
router.route("/changeUserPassword").put(verifyJWT, changeUserPassword)
router.route("/getAllUsers").get(getAllUsers)
router.route("/deleteUser/:id").delete(deleteUser)
router.route("/changeUserRole/:id").put(changeUserRole)

export default router