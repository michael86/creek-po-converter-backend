import { RequestHandler } from "express";
import { PdfUpload } from "../types/pdf";
import { insertPurchaseOrder } from "../queries/pdf";

export const insertPdf: RequestHandler = async (req: PdfUpload, res) => {
  try {
    const { pdfData } = req;
    if (!pdfData) {
      res.status(400).json({ status: "error", message: "No PDF provided" });
      return;
    }

    const { purchaseOrder, orderRef, data } = pdfData;

    const purchaseId = await insertPurchaseOrder(purchaseOrder, orderRef);
    if (!purchaseId) {
      throw new Error("Error inserting purchase order");
    }

    console.log("Inserted Purchase Order ID:", purchaseId);

    res.status(201).json({
      status: "success",
      message: "Purchase order inserted successfully",
    });
  } catch (error) {
    console.error("Error inserting PDF:\n", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
    return;
  }
};
