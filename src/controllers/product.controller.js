import asyncHandler from "../utils/asyncHandler.js"
import { Product } from "../models/product.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import uploadOnCloudinary from "../utils/cloudinary.js"

const addProduct = asyncHandler(async (req, res) => {

    const { title, description, cat_id, quantity, price } = req.body
    if(
        [title, description, cat_id, quantity, price].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    let imageLocalPath;
    if (req.files && Array.isArray(req.files.image) && req.files.image.length > 0) 
    {
        imageLocalPath = req.files.image[0].path
    }
    let prodImage = await uploadOnCloudinary(imageLocalPath)

    const product = await Product.create({
        title,
        description,
        cat_id,
        quantity,
        price,
        image: prodImage.url || ""
    })

    const createdProduct = await Product.findById(product._id)

    if(!createdProduct) {
        throw new ApiError(500, "Something went wrong while creating product")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            createdProduct,
            "Product created successfully"
        )
    )

})

export {
    addProduct
}