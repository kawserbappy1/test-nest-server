import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT } from "./secret.js";
import connectionDB from "./configs/dbConnection.js";
import cloudinaryConnection from "./configs/cloudinary.js";
import userRoute from "./routers/userRoutes.js";
import categoryRoute from "./routers/categoryRoutes.js";
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

await connectionDB();
await cloudinaryConnection();

// All routes
//user route
app.use("/api/v1/user", userRoute);
//category route
app.use("/api/v1/category", categoryRoute);

app.get("/", (req, res) => {
  res.send("This server is running from testy nest server");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
