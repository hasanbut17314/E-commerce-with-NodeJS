import mongoose, {Schema} from "mongoose";

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Active", "Hidden"],
        default: "Active"
    },
    image: {
        type: String
    }
}, {timestamps: true})

export const Category = mongoose.model("Category", categorySchema)