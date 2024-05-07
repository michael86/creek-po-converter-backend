import { RequestHandler } from "express";
import { patchPartialStatus, addParcelsToOrder, removePartFromOrder } from "../db/queries/orders";
import { validate } from "../middleware/validate";
import { body, param } from "express-validator";
import { addLog } from "../middleware/logs";
import { AddParcelBody } from "../types/generic";

const express = require("express");
const router = express.Router();

const updatePartialStatus: RequestHandler = async (req, res) => {
  try {
    const { index } = req.params;

    const result = await patchPartialStatus(Number(index));
    if (!result) throw new Error(`Failed to patch partial status `);

    res.send({ status: 1, token: req.headers.newToken });
  } catch (error) {
    console.error(`error setting part_number to partial parcel: ${error}`);
    res.status(500).send({ status: 0 });
  }
};

const addParcel: RequestHandler = async (req, res) => {
  try {
    const { parcels, index }: AddParcelBody = req.body;

    if (!parcels || !index) {
      res.status(400).send();
      return;
    }

    const result = await addParcelsToOrder(parcels, index);

    res.send({ status: result ? 1 : 0, token: req.headers.newToken });
  } catch (error) {
    console.error(`error trying to add new parcels to order ${error}`);
    res.send({ status: 0 });
  }
};

const deletePart: RequestHandler = async (req, res) => {
  try {
    const { lineId } = req.body;
    if (!lineId) return res.status(400).send({ token: req.headers.newToken });

    const result = await removePartFromOrder(lineId);

    res.send({ token: req.headers.newToken });
  } catch (error) {
    console.error(error);
    res.status(500).send({ token: req.headers.newToken });
  }
};

router.patch(
  "/set-partial/:index?",
  validate([param("index").exists().trim().isNumeric()]),
  addLog("setPartial"),
  updatePartialStatus
);
router.put(
  "/add-parcel/",
  validate([
    body("parcels.*").exists().trim().isNumeric(),
    body("index").exists().trim().isNumeric(),
  ]),
  addLog("addParcel"),
  addParcel
);

router.post("/delete/", validate([body("lineId").exists().trim().isNumeric()]), deletePart);

module.exports = router;
