import { Request, RequestHandler, Response } from "express";
import {
  deletePurchaseOrderById,
  putThreshold,
  selectPurchaseOrderByUuid,
  selectPurchaseOrderNames,
} from "../queries/purchaseOrders";

import { UpdateLocationRequest } from "../types/purchase_orders";
import { setPartLocation } from "../queries/locations";

export const deletePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await deletePurchaseOrderById(id);

    if (!deleted) {
      res.status(404).json({ status: "error", message: "Purchase order not found" });
      return;
    }

    res.status(200).json({ status: "success", message: "Purchase order deleted" });
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const handleNames: RequestHandler = async (req, res, next) => {
  try {
    const names = await selectPurchaseOrderNames();

    if (!names) throw new Error("Failed to select all purchase order names");

    res.status(200).json({ status: "success", data: names });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internale Server Error" });

    return;
  }
};

export const selectPurchaseOrder: RequestHandler = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    if (!uuid) {
      res.status(400).json({ status: "error", message: "Uuid missing or invalid" });
      return;
    }

    const data = await selectPurchaseOrderByUuid(uuid);

    if (!data) throw new Error(`Failed to select purchase order for ${uuid}`);

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internale Server Error" });

    return;
  }
};

export const updateLocation: RequestHandler = async (req: UpdateLocationRequest, res) => {
  try {
    const { partNumber } = req.params;
    const { location } = req.body;

    const locationSet = await setPartLocation(partNumber, location);

    if (!locationSet) {
      res.status(400).json({
        status: "error",
        message: `No parts updated. Invalid part number or same location already set.`,
      });
      return;
    }

    res.status(200).json({ status: "success", message: "Location updated" });
  } catch (error) {
    console.error("Error updating location", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const setThreshold: RequestHandler = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { state } = req.body;

    await putThreshold(uuid, state);

    res.status(200).json({ status: 1, message: "State updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: "internal server error" });
  }
};
