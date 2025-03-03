import { Router } from "express";

const route = Router();

route.post("/upload", async (req, res, next) => {
  try {
    console.log("upload complete");
    res.status(200).json({ status: "success", message: "pdf uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "internal server error" });
  }
});

export default route;
