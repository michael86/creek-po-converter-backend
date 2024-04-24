import { RequestHandler } from "express";
import { patchPartialStatus, addParcelsToOrder } from "../db/queries/orders";

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

type AddParcelBody = { parcels: number[]; purchaseOrder: string; part: string };
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

router.patch("/set-partial/:order?/:name?", updatePartialStatus);
router.put("/add-parcel/", addParcel);
module.exports = router;
