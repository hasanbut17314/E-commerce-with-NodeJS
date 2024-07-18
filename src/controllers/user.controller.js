import asyncHandler from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const registerController = asyncHandler(async (req, res) => {

    const {username, email, password, confirmPassword} = req.body
    if(
        [username, email, password, confirmPassword].some((field) => field?.trim() === "")
    ) 
    {
        throw new ApiError(400, "All fields are required")
    }

    if (password !== confirmPassword) {
        throw new ApiError(406, "password and confirm password does not match")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if (existedUser) {
        throw new ApiError(406, "user with email or username already exists")
    }

    const user = await User.create({
        username,
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while storing user details")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

export {
    registerController
}