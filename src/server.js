import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// middleware
app.use(express.json());
app.express.urlencoded({ extended: true });
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("This server is running from testy nest server");
});
