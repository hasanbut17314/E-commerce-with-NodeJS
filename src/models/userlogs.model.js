import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema(
    {
        ip: String,
        country: String,
        region: String,
        city: String,
        userAgent: String,
        browser: String,
        os: String,
        device: String,
    },
    { timestamps: true }
);

export const UserLog = mongoose.model("UserLog", userLogSchema);
