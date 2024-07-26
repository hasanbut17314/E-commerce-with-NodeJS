import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { Cart } from "../models/cart.model.js"
import { Product } from "../models/product.model.js"

const addToCart = asyncHandler(async (req, res) => {

    const { prod_id, quantity } = req.body
    if (!prod_id || !quantity) {
        throw new ApiError(400, "Product Id and Quantity are required")
    }

    const product = await Product.findById(prod_id)
    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    if (product.quantity < quantity) {
        throw new ApiError(400, "Insufficient quantity")
    }

    const userId = req.user._id
    let cart = await Cart.findOne({ user_id: userId })
    if (!cart) {
        cart = new Cart({
            user_id: userId,
            prod_items: []
        })
    }

    const itemIndex = cart.prod_items.findIndex(item => item.prod_id.toString() === prod_id.toString())

    if (itemIndex > -1) {
        cart.prod_items[itemIndex].quantity += quantity
    } else {
        cart.prod_items.push({
            prod_id,
            quantity,
            price: product.price
        })
    }
    await cart.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            cart,
            "Product added to cart successfully"
        )
    )

})

const updateItemQuantity = asyncHandler(async (req, res) => {

    const { prod_id, quantity } = req.body
    if (!prod_id || !quantity) {
        throw new ApiError(400, "Product Id and Quantity are required")
    }

    const userId = req.user._id
    let cart = await Cart.findOne({ user_id: userId })
    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }

    const itemIndex = cart.prod_items.findIndex(item => item.prod_id.toString() === prod_id.toString())

    if (itemIndex === -1) {
        throw new ApiError(404, "Product not found in cart")
    } 

    cart.prod_items[itemIndex].quantity = quantity
    await cart.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            cart,
            "Product quantity updated successfully"
        )
    )
})

const getCart = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const cart = await Cart.findOne({ user_id: userId })

    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            cart,
            "Cart fetched successfully"
        )
    )

})

const deleteItemFromCart = asyncHandler(async (req, res) => {

    const { prod_id } = req.body
    if (!prod_id) {
        throw new ApiError(400, "Product Id is required")
    }

    const userId = req.user._id
    let cart = await Cart.findOne({ user_id: userId })
    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }

    const itemIndex = cart.prod_items.findIndex(item => item.prod_id.toString() === prod_id.toString()) 

    if (itemIndex === -1) {
        throw new ApiError(404, "Product not found in cart")
    }

    cart.prod_items.splice(itemIndex, 1)
    await cart.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            cart,
            "Product deleted from cart successfully"
        )
    )

})

const emptyCart = asyncHandler(async (req, res) => {

    const userId = req.user._id
    let cart = await Cart.findOne({ user_id: userId })
    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }

    cart.prod_items = []
    await cart.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            cart,
            "Cart emptied successfully"
        )
    )
})

export {
    addToCart,
    updateItemQuantity,
    getCart,
    deleteItemFromCart,
    emptyCart
}