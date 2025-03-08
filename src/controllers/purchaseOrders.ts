import { Request, Response } from "express";
import { deletePurchaseOrderById } from "../queries/purchaseOrders";

export const deletePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { orderId }: { orderId: number } = res.locals as { orderId: number };

    const deleted = await deletePurchaseOrderById(orderId);

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
