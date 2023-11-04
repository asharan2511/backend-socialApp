import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

//POST register

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).send({
        success: false,
        message: "User is already reagistered with the same Email ID",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar: {
        public_id: "hello",
        url: "Hello",
      },
    });
    if (!createUser) {
      res.status(400).send({ success: false, message: "User is not created" });
    }
    res.status(201).send({
      success: true,
      message: "User created successfully,Please login.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ success: false, message: "Error Registering User" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User is not Registered" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res
        .status(200)
        .send({ success: false, message: "Wrong Credentials" });
    }
    const token = jwt.sign(
      { user: { email, password, id: user._id } },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 90 * 60 * 1000),
        httpOnly: true,
      })
      .status(200)
      .send({ success: true, message: "User logged in successfully" });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Authentication Failed!" });
  }
};

export const followUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    const currUser = req.user;
    const findUser = currUser.following.includes(user._id);
    if (findUser) {
      const index = currUser.following.indexOf(user._id);
      currUser.following.splice(index, 1);
      const index1 = user.followers.indexOf(req.user._id);
      console.log(req.user._id);
      user.followers.splice(index1, 1);
      await user.save();
      await currUser.save();
      return res
        .status(200)
        .send({ success: true, message: "unfollowed Successfully" });
    } else {
      currUser.following.push(user._id);
      user.followers.push(currUser._id);
      await user.save();
      await currUser.save();

      return res
        .status(200)
        .send({ success: true, message: "Followed Successfully" });
    }
  } catch (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", null, {
        expiresIn: new Date(Date.now()),
        httpOnly: true,
      })
      .send({ success: true, message: "Logged out" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ success: false, message: "Old password is wrong" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res
      .status(200)
      .send({ success: true, message: "Password is changed successfully" });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
