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

const updateCategory = asyncHandler(async (req, res) => {

    const {title, description} = req.body
    if(!title || !description) {
        throw new ApiError(400, "All fields are required")
    }

    const category = await Category.findById(req.params.id)

    if(!category) {
        throw new ApiError(404, "Category not found")
    }

    category.title = title
    category.description = description

    if (req.files && Array.isArray(req.files.image) && req.files.image.length > 0) {
        let imageLocalPath = req.files.image[0].path
        try {
            const catImage = await uploadOnCloudinary(imageLocalPath)
            category.image = catImage.url
        } catch (error) {
            throw new ApiError(500, "Image upload failed");
        }
    }

    await category.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            category,
            "Category updated successfully"
        )
    )
})

const deleteCategory = asyncHandler(async (req, res) => {

    const category = await Category.findById(req.params.id)

    if(!category) {
        throw new ApiError(404, "Category not found")
    }

    await category.remove()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Category deleted successfully"
        )
    )
})

const getAllCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find()
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            categories,
            "Categories fetched successfully"
        )
    )
})

export {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
}