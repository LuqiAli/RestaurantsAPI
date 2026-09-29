import cors from "cors";
import { FRONTEND_URL } from "./env";

const allowedOrigins = [
    FRONTEND_URL
]

export const corsMiddleware = cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
})

