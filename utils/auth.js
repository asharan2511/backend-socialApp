import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById({ _id: decode.user.id });
      if (!user) {
        res
          .status(400)
          .send({ success: false, message: "Authentication Failed" });
      }
      req.token = token;
      req.user = user;
      next();
    } else {
      res
        .status(404)
        .send({ success: false, message: "Authentication Failed" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: "Auth Failed from catch" });
  }
};
