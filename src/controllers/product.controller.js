import asyncHandler from "../utils/asyncHandler.js"
import { Product } from "../models/product.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const addProduct = asyncHandler(async (req, res) => {

    const { title, description, cat_id, quantity, price, isFeatured, status } = req.body
    if (
        [title, description, cat_id, quantity, price, isFeatured, status].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    let imageLocalPath;
    if (req.file) {
        imageLocalPath = req.file.path
    }

    let prodImage;
    if (imageLocalPath) {
        try {
            prodImage = await uploadOnCloudinary(imageLocalPath);
        } catch (error) {
            throw new ApiError(500, "Image upload failed");
        }
    } else {
        prodImage = { url: "" };
    }

    const product = await Product.create({
        title,
        description,
        cat_id,
        quantity,
        price,
        isFeatured,
        status,
        image: prodImage.url || ""
    })

    const createdProduct = await Product.findById(product._id)

    if (!createdProduct) {
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

const updateProduct = asyncHandler(async (req, res) => {

    const { title, description, cat_id, quantity, price, isFeatured, status } = req.body
    if (
        [title, description, cat_id, quantity, price, isFeatured, status].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const product = await Product.findById(req.params.id)

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    product.title = title
    product.description = description
    product.cat_id = cat_id
    product.quantity = quantity
    product.price = price
    product.isFeatured = isFeatured
    product.status = status

    if (req.file) {
        let imageLocalPath = req.file.path
        try {
            const prodImage = await uploadOnCloudinary(imageLocalPath)
            product.image = prodImage.url
        } catch (error) {
            throw new ApiError(500, "Image upload failed");
        }
    }

    const updatedProduct = await product.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedProduct,
                "Product updated successfully"
            )
        )
})

const getAllProducts = asyncHandler(async (req, res) => {

    const { limit = 15, page = 1, status, isFeatured } = req.query
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)

    const query = {}
    if(status) {
        query.status = status
    }
    if(isFeatured) {
        query.isFeatured = isFeatured
    }

    const products = await Product.find(query)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .sort({createdAt: -1})
    
    const totalProducts = await Product.countDocuments(query)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                products,
                pagination: {
                    page: pageNumber,
                    total: totalProducts,
                    pages: Math.ceil(totalProducts / limitNumber)
                }
            },
            "Products fetched successfully"
        )
    )

})

const productById = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Product fetched successfully"
            )
        );
})

const productByCateId = asyncHandler(async (req, res) => {

    const {limit = 15, page = 1, status} = req.query
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)

    let query = {
        cat_id: req.params.id,
    }
    if(status) {
        query.status = status
    }

    const products = await Product.find(query)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .sort({createdAt: -1})

    const totalProducts = await Product.countDocuments(query)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                products,
                pagination: {
                    page: pageNumber,
                    total: totalProducts,
                    pages: Math.ceil(totalProducts / limitNumber)
                }
            },
            "Products fetched successfully"
        )
    )
})

const deleteProduct = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id)

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    await Product.findByIdAndDelete(req.params.id)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Product deleted successfully"
        )
    )
})

const searchProducts = asyncHandler(async (req, res) => {
    const { searchTerm, page = 1, limit = 10, status } = req.query

    const regex = new RegExp(searchTerm, 'i')
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)

    const query = {
        $or: [
            { title: regex },
            { description: regex },
        ],
    }
    if (status) {
        query.status = status
    }

    const products = await Product.find(query)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)

    const totalProducts = await Product.countDocuments(query)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                products,
                pagination: {
                    total: totalProducts,
                    page: pageNumber,
                    pages: Math.ceil(totalProducts / limitNumber),
                },
            },
            "Products fetched successfully"
        )
    )
})


export {
    addProduct,
    updateProduct,
    getAllProducts,
    productById,
    productByCateId,
    deleteProduct,
    searchProducts
}