import { RequestHandler } from "express";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const validateDeleteParam: RequestHandler = (req, res, next) => {
  try {
    const orderId = req.params.id;

    if (!orderId || !UUID_REGEX.test(orderId)) {
      res.status(400).json({ status: "error", message: "Purchase order ID not found or invalid" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error validating delete parameter:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
    return;
  }
};
