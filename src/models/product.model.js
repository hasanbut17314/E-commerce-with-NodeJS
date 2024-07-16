import mongoose, {Schema} from "mongoose";

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true,
    },
    cat_id: {
        type: Schema.Types.ObjectId,
        ref: "Category"
    },
    image: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ["Hidden", "Active"],
        default: "Active"
    }
}, {timestamps: true})

export const Product = mongoose.model("Product", productSchema)