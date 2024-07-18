import mongoose, {Schema, mongo} from "mongoose";

const itemSchema = new Schema({
    prod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
})

const cartSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    prod_items: [itemSchema],
    total_price: {
        type: Number,
        required: true
    }
})

cartSchema.pre("save", function(next) {
    this.total_price = this.prod_items.reduce((total, item) => total + item.quantity * item.price, 0);
    next();
})

export const Cart = mongoose.model("Cart", cartSchema)