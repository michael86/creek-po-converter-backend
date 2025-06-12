import { Router } from "express";

const router = Router();

router.post("/add", async (resizeBy, res) => {
  console.log("add delivery");
  res.status(200).json({ status: 1, message: "All okay" });
});

export default router;
