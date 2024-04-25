import { selectPartId, selectPurchaseOrderId } from "../db/queries/utils";
import { insertLocation, selectLocationId, selectLocationIdForPart } from "../db/queries/locations";
import { RequestHandler } from "express";
import { validate } from "../middleware/validate";
import { body } from "express-validator";

const express = require("express");
const router = express.Router();

const updateLocation: RequestHandler = async (req, res) => {
  try {
    const { order, part, location } = req.body;
    if (!order || !part || !location) {
      res.status(400).send({ token: req.headers.newToken });
    }

    const orderId = await selectPurchaseOrderId(order);
    if (!orderId) throw new Error(`Failed to select order id for ${order}`);

    const partId = await selectPartId(part);
    if (!partId) throw new Error(`Failed to select part id for ${part}`);

    const id = await selectLocationIdForPart(orderId, partId);
    const locationId = await selectLocationId(location);
    if (!locationId) throw new Error("Failed to select location id");
    // purchaseId, partId, location;
    const query = id
      ? `UPDATE po_pn_location SET location = ? WHERE purchase_order = ? AND part_number = ?`
      : `INSERT INTO po_pn_location (location, purchase_order, part_number) VALUES (?, ?, ?)`;

    const updated = await insertLocation(orderId, partId, locationId, query);
    if (!updated) throw new Error(`Failed to insert location for part`);

    res.send({ token: req.headers.newToken });
  } catch (error) {
    console.error(error);
    res.status(500).send({ token: req.headers.newToken });
  }
};

router.post(
  "/update",
  validate([
    body("order").trim().notEmpty(),
    body("part").trim().notEmpty(),
    body("location").trim().notEmpty(),
  ]),
  updateLocation
);

module.exports = router;
