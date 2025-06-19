import { RequestHandler, Request, Response, NextFunction } from "express";
import { UpdateLocationRequest } from "../types/purchase_orders";
import { selectLocationIdByName } from "../queries/locations";
import { body, param, validationResult } from "express-validator";

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

export const validateUpdateLocation: RequestHandler = async (
  req: UpdateLocationRequest,
  res,
  next
) => {
  try {
    const { uuid, partNumber } = req.params;
    const { location } = req.body;

    if (!uuid || !UUID_REGEX.test(uuid) || !partNumber || !location) {
      res
        .status(400)
        .json({ status: "error", message: "Invalid id or part number or location missing" });
      return;
    }

    const locationValid = await selectLocationIdByName(location);

    if (!locationValid) {
      res.status(404).json({ status: "error", message: "Invalid location" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error updating item location\n", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
    return;
  }
};

export const validateThreshold = [
  body("state")
    .exists()
    .withMessage("state must be present")
    .bail()
    .isBoolean()
    .withMessage("state must be a boolean"),
  param("uuid").trim().isString().withMessage("Order Id must be present and valid"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array() });
      return;
    }

    next();
  },
];
