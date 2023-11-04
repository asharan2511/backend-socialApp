import express from "express";
import {
  followUser,
  loginUser,
  registerUser,
} from "../controller/userController.js";
import { isAuthenticated } from "../utils/auth.js";
const userRouter = express.Router();

userRouter
  .post("/user/register", registerUser)
  .post("/user/login", loginUser)
  .get("/user/follow/:id", isAuthenticated, followUser);

export default userRouter;
