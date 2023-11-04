import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnect } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import postRouter from "./routes/postRoute.js";
const app = express();
dotenv.config();
dbConnect();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

//routes

app.use("/api", userRouter);
app.use("/api", postRouter);

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
