import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
export const tokenRequire = async (req, res, next) => {
  try {
    const decode = jwt.verify(req.headers.authorization, process.env.JWT_Token);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Please Enter Token",
      error,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    let user = await userModel.findById({ _id: req.user._id });
    if (user?.role == 1) {
      next();
    } else {
      return res.status(401).send("Not Admin Sorry");
    }
  } catch (error) {
    res.status(500).send({ message: "error in Admin Authorization ", error });
  }
};
