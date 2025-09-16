import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import useragent from "useragent";
import { UserLog } from "./models/userlogs.model.js";

const app = express()

const corsOptions = {
    origin: '*',
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.set("trust proxy", true);

// routes import
import userRouter from "./routes/user.route.js"
import productRouter from "./routes/product.route.js"
import categoryRouter from "./routes/category.route.js"
import cartRouter from "./routes/cart.route.js"
import orderRouter from "./routes/order.route.js"

app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/category", categoryRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/track", async (req, res) => {
    try {
        const ip = req.ip;

        const uaString = req.headers["user-agent"] || "Unknown";
        const agent = useragent.parse(uaString);

        // --- Geo lookup (free API) ---
        let geo = {};
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
            geo = await geoRes.json();
        } catch (e) {
            console.error("Geo lookup failed:", e.message);
        }

        // --- Save to DB ---
        const log = new UserLog({
            ip,
            country: geo.country || "Unknown",
            region: geo.regionName || "Unknown",
            city: geo.city || "Unknown",
            userAgent: uaString,
            browser: agent.toAgent(),
            os: agent.os.toString(),
            device: agent.device.toString(),
        });

        await log.save();

        res.json({ success: true, log });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error", error: err });
    }
});

export default app