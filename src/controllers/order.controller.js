import asyncHandler from "../utils/asyncHandler.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"
import { Order } from "../models/order.model.js"
import { Cart } from "../models/cart.model.js"
import { Product } from "../models/product.model.js"

const createOrder = asyncHandler(async (req, res) => {

    const { address, contact_number, order_items } = req.body
    if (!address || !contact_number || !order_items || order_items.length === 0) {
        throw new ApiError(400, "All fields are required and order items should be at least one")
    }

    const userId = req.user._id
    const cart = await Cart.findOne({ user_id: userId })
    if (!cart) {
        throw new ApiError(404, "Cart not found")
    }

    const orderNo = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    order_items.forEach(async (item) => {
        const product = await Product.findById(item.prod_id)
        if (!product) {
            throw new ApiError(404, "Product not found")
        }
        if (product.quantity < item.quantity) {
            throw new ApiError(400, "Insufficient quantity for product : " + product.title)
        }
        product.quantity -= item.quantity
        await product.save()
    })

    const order = new Order({
        user_id: userId,
        order_no: orderNo,
        address,
        contact_number,
        order_items
    })
    await order.save()
    await cart.remove()

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            order,
            "Order created successfully"
        )
    )
})

const getOrder = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const order = await Order.findOne({ user_id: userId })
    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            order,
            "Order fetched successfully"
        )
    )
})

const updateOrderStatus = asyncHandler(async (req, res) => {

    const { status } = req.body
    const { id } = req.params
    if (!id || status !== "Pending" || status !== "Delivered" || status !== "Cancelled" || status !== "Shipped") {
        throw new ApiError(400, "Invalid Status or id! Select between Pending, Delivered, Cancelled, Shipped")
    }

    const order = await Order.findById(id)
    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    if(status === "Cancelled" && order.status !== "Cancelled") {

        order.order_items.forEach(async (item) => {
            const product = await Product.findById(item.prod_id)
            if (!product) {
                throw new ApiError(404, "Product not found")
            }
            product.quantity += item.quantity
            await product.save()
        })

    }

    order.status = status
    await order.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            order,
            "Order status updated successfully"
        )
    )

})

const deleteOrder = asyncHandler(async (req, res) => {

    const { id } = req.params
    if (!id) {
        throw new ApiError(400, "Id is required")
    }

    const order = await Order.findById(id)
    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    if (order.status !== 'Delivered' && order.status !== 'Cancelled') {
        throw new ApiError(400, "Only delivered or cancelled orders can be deleted");
    }

    await order.remove()    

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Order deleted successfully"
        )
    )
})

export {
    createOrder,
    getOrder,
    updateOrderStatus,
    deleteOrder
}