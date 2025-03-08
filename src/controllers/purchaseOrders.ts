import { Request, RequestHandler, Response } from "express";
import { deletePurchaseOrderById, selectPurchaseOrderNames } from "../queries/purchaseOrders";

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
