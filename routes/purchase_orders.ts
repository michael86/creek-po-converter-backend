import { RequestHandler } from "express";
import {
  patchPartialStatus,
  addParcelsToOrder,
  removePartFromOrder,
  updateDateDue,
} from "../db/queries/orders";
import { validate } from "../middleware/validate";
import { addLog } from "../middleware/logs";
import { AddParcelBody } from "../types/generic";
import {
  ORDER_ADD_PARCEL,
  ORDER_DELETE,
  ORDER_SET_PARTIAL,
  ORDER_UPDATE,
} from "../middleware/validationSchema";
import { errorHandler } from "../middleware/errorHandler";
import { updateDescription, updateTotalOrdered } from "../db/queries/utils";
import { STATUS_SUCCESS } from "../utils/constants";

const express = require("express");
const router = express.Router();

const updatePartialStatus: RequestHandler = async (req, res, next) => {
  try {
    const { index } = req.params;

    const result = await patchPartialStatus(Number(index));
    if (!result) throw new Error(`Failed to patch partial status `);

    res.send({ status: 1, token: req.headers.newToken });
  } catch (error) {
    next(error);
  }
};

const addParcel: RequestHandler = async (req, res, next) => {
  try {
    const { parcels, index }: AddParcelBody = req.body;

    if (!parcels || !index) {
      res.status(400).send();
      return;
    }

    const result = await addParcelsToOrder(parcels, index);

    res.send({ status: result ? 1 : 0, token: req.headers.newToken });
  } catch (error) {
    next(error);
  }
};

const deletePart: RequestHandler = async (req, res, next) => {
  try {
    const { lineId } = req.body;
    if (!lineId) return res.status(400).send({ token: req.headers.newToken });
    await removePartFromOrder(lineId);
    res.send({ token: req.headers.newToken });
  } catch (error) {
    next(error);
  }
};

const updatePart: RequestHandler = async (req, res, next) => {
  try {
    const { description, count, dateDue, lineId } = req.body;

    description && (await updateDescription(description, lineId));
    count && (await updateTotalOrdered(count, lineId));
    dateDue && (await updateDateDue(dateDue, lineId));

    res.send({ status: STATUS_SUCCESS, token: req.headers.newToken });
  } catch (error) {
    next(error);
  }
};

router.patch(
  "/set-partial/:index?",
  validate(ORDER_SET_PARTIAL),
  addLog("setPartial"),
  updatePartialStatus
);
router.put("/add-parcel/", validate(ORDER_ADD_PARCEL), addLog("addParcel"), addParcel);
router.post("/delete/", validate(ORDER_DELETE), deletePart);
router.post("/update/", validate(ORDER_UPDATE), updatePart);

router.use(errorHandler);

module.exports = router;
