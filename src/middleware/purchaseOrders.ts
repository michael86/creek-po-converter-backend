import { RequestHandler } from "express";

export const validateDeleteParam: RequestHandler = (req, res, next) => {
  try {
    const orderId = Number(req.params.id);

    if (!orderId || !Number.isInteger(orderId)) {
      res.status(400).json({ status: "error", message: "Purchase order ID not found or invalid" });
      return;
    }

    res.locals.orderId = orderId;
    next();
  } catch (error) {
    console.error("Error validating delete parameter:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
    return;
  }
};
