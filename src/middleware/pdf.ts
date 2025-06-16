import { RequestHandler } from "express";
import { PdfUpload } from "../types/pdf";
import { processFile } from "../utils/pdf";
import { PdfError } from "../utils/pdfError";

export const validatePDF: RequestHandler = async (req: PdfUpload, res, next) => {
  try {
    const { file } = req;

    if (!file) {
      res.status(400).json({ status: "error", message: "No file provided" });
      return;
    }

    const { path: filePath } = file;
    const result = await processFile(filePath);

    req.pdfData = result;
    next();
  } catch (error) {
    if (error instanceof PdfError) {
      res.status(error.status).json({ status: "error", message: JSON.stringify(error.message) });
      return;
    }

    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
