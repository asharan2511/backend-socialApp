import express from "express";
import { isAuthenticated } from "../utils/auth.js";
import {
  createPost,
  deletePost,
  likeAndUnlikepost,
} from "../controller/postController.js";
const postRouter = express.Router();

postRouter
  .post("/post/create", isAuthenticated, createPost)
  .get("/post/:id", isAuthenticated, likeAndUnlikepost)
  .delete("/post/:id", isAuthenticated, deletePost);

export default postRouter;
