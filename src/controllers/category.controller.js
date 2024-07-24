import asyncHandler from "../utils/asyncHandler.js";
import { Category } from "../models/category.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const addCategory = asyncHandler(async (req, res) => {

    const {title, description} = req.body
    if(!title || !description) {
        throw new ApiError(400, "All fields are required")
    }

    let imageLocalPath;
    if (req.files && Array.isArray(req.files.image) && req.files.image.length > 0) 
    {
        imageLocalPath = req.files.image[0].path
    }
    let catImage;
    if (imageLocalPath) {
        try {
            catImage = await uploadOnCloudinary(imageLocalPath);
        } catch (error) {
            throw new ApiError(500, "Image upload failed");
        }
    } else {
        catImage = { url: "" };
    }

    const category = await Category.create({
        title,
        description,
        image: catImage.url || ""
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            category,
            "Category created successfully"
        )
    )
})

export {
    addCategory
}