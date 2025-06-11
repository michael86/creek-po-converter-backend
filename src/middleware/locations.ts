import { RequestHandler } from "express";

export const validateLocationUpdate: RequestHandler = (req, res, next) => {
  try {
    const location = req.body.data;
    console.log("location ", location);
    next();
  } catch (error) {
    res.status(500).json({ status: 0, message: "Internal Server Error" });
    return;
  }
};
