import Post from "../models/post.js";
import User from "../models/user.js";

export const createPost = async (req, res) => {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "req.body.public_id",
        url: "req.body.url",
      },
      owner: req.user._id,
    };
    const newPost = await Post.create(newPostData);
    const user = await User.findById(req.user._id);
    user.posts.push(newPost._id);
    await user.save();
    res
      .status(201)
      .send({ success: true, message: "Post is created successfully" });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

export const likeAndUnlikepost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.send(400).send({ success: false, message: "Post not found" });
    }
    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);
      post.likes.splice(index, 1);
      await post.save();

      return res.status(200).send({ success: true, message: "Post unliked" });
    }
    post.likes.push(req.user._id);
    await post.save();
    return res.status(200).send({ success: true, message: "Post liked" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .send({ success: false, message: "Post not found" });
    }
    if (post.owner.toString() !== req.user._id.toString()) {
      res.status(400).send({ success: false, message: "Unauthorized" });
    }

    const ifDleteted = await Post.deleteOne(post._id);
    if (!ifDleteted) {
      return res
        .status(400)
        .send({ success: false, message: "Post was not deleted Successfully" });
    }
    const user = req.user;
    const index = user.posts.indexOf(req.params.id);
    await user.posts.splice(index, 1);
    await user.save();
    res
      .status(200)
      .send({ success: true, message: "Post was deleted Successfully" });
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};

export const getPostOfFollwing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = await Post.find({
      owner: { $in: user.following },
    });
    res.status(200).send({ success: true, message: "post retrieved", posts });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
