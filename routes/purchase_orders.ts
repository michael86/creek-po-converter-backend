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
    const { order, name } = req.params;
    const result = await patchPartialStatus(order, name);
    if (!result) throw new Error(`Failed to patch partial status \nOrder:${order} \nName${name}`);

    res.send({ status: 1, token: req.headers.newToken });
  } catch (error) {
    console.error(`error setting part_number to partial parcel: ${error}`);
    res.status(500).send({ status: 0 });
  }
};

const addParcel: RequestHandler = async (req, res) => {
  try {
    const { parcels, purchaseOrder, part }: AddParcelBody = req.body;

    if (!parcels || !purchaseOrder || !part) {
      res.status(400).send();
      return;
    }

    const result = await addParcelsToOrder(parcels, purchaseOrder, part);

    res.send({ status: result ? 1 : 0, token: req.headers.newToken });
  } catch (error) {
    console.error(`error trying to add new parcels to order ${error}`);
    res.send({ status: 0 });
  }
};

const deletePart: RequestHandler = async (req, res) => {
  try {
    const { order, name }: { order: string; name: string } = req.body;
    if (!name || !order) return res.status(400).send({ token: req.headers.newToken });

    const result = await removePartFromOrder(order, name.toUpperCase());

    res.send({ token: req.headers.newToken });
  } catch (error) {
    console.error(error);
    res.status(500).send({ token: req.headers.newToken });
  }
};

router.patch(
  "/set-partial/:order?/:name?",
  validate([param("order").exists().trim(), param("name").exists().trim()]),
  addLog("setPartial"),
  updatePartialStatus
);
router.put(
  "/add-parcel/",
  validate([
    body("parcels.*").exists().trim().isNumeric(),
    body("purchaseOrder").trim().exists(),
    body("part").exists().trim(),
  ]),
  addLog("addParcel"),
  addParcel
);

router.post(
  "/delete/",
  validate([body("name").exists().trim(), body("order").exists().trim()]),
  deletePart
);

module.exports = router;
