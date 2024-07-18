import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    order_no: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: true
    },
    order_items: [{
        prod_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    total_price: {
        type: String,
        required: true
    }
}, {timestamps: true})

orderSchema.pre("save", function(next) {
    this.total_price = this.order_items.reduce((total, item) => total + item.quantity * item.price, 0);
    next();
})

export const Order = mongoose.model("Order", orderSchema)