import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // to use encoded values from url like "%20"
app.use(express.static("public"));
app.use(cookieParser());

// router import
import userRouter from "./routes/user.routes.js"; // code segregation

// routes declaration
app.use("/api/v1/users", userRouter); // passes control to userRouter

export { app };
