import { Request, RequestHandler, Response } from "express";
import {
  deletePurchaseOrderById,
  selectPurchaseOrderByUuid,
  selectPurchaseOrderNames,
} from "../queries/purchaseOrders";

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
