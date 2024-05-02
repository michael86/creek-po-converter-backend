import { selectPartId, selectPurchaseOrderId } from "../db/queries/utils";
import {
  insertLocation,
  patchLocation,
  selectLocationId,
  selectLocationIdForPart,
} from "../db/queries/locations";
import { RequestHandler } from "express";
import { validate } from "../middleware/validate";
import { body } from "express-validator";
import { addLog } from "../middleware/logs";

const express = require("express");
const router = express.Router();

const updateLocation: RequestHandler = async (req, res) => {
  try {
    const { location, line } = req.body;
    if (!location || !line) {
      res.status(400).send({ token: req.headers.newToken });
    }

    const locationId = await selectLocationId(location);
    if (!locationId) throw new Error("Failed to select location id");

    const updated = await patchLocation(locationId, line);
    if (!updated) throw new Error(`Failed to insert location for part`);

    res.send({ token: req.headers.newToken });
  } catch (error) {
    console.error(error);
    res.status(500).send({ token: req.headers.newToken });
  }
};

router.post(
  "/update",
  validate([body("line").trim().notEmpty().isNumeric(), body("location").trim().notEmpty()]),
  addLog("updateLocation"),
  updateLocation
);

module.exports = router;
