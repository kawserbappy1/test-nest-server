import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGODB_STRING_URI;
export const CLOUDE_NAME = process.env.CLOUDE_NAME;
export const CLOUDE_API = process.env.CLOUDE_API;
export const CLOUDE_API_SECRET = process.env.CLOUDE_API_SECRET;
