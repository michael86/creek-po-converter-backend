import { RequestHandler } from "express";
import { PdfUpload } from "../types/pdf";

export const insertPdf: RequestHandler = async (req: PdfUpload, res, next) => {
  try {
    const { pdfData } = req;
    if (!pdfData) {
      res.status(400).json({ status: "error", message: "No pdf provided" });
      return;
    }

    const { purchaseOrder, orderRef, data } = pdfData;
    console.log(pdfData);
  } catch (error) {
    console.error("Error inserting pdf\n", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
    return;
  }
};
