import asyncHandler from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

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

const loginController = asyncHandler(async (req, res) => {

    const {userEmail, password} = req.body

    if(!userEmail || !password) {
        throw new ApiError(400, "username or email and password is required")
    }

    const user = await User.findOne({
        $or: [
            { username: userEmail },
            { email: userEmail }
        ]
    })

    if(!user) {
        throw new ApiError(404, "username or email not found")
    }

    const validPassword = await user.isPasswordCorrect(password)
    if(!validPassword) {
        throw new ApiError(401, "Invalid Password! Try Again")
    }

    const {refreshToken, accessToken} = generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
            user: loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully"
        )
    )

})

const logoutController = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out successfully"))
})

export {
    registerController,
    loginController,
    logoutController
}