import { RequestHandler } from "express";
import { PdfUpload } from "../types/pdf";
import { processFile } from "../utils/pdf";

export const validatePDF: RequestHandler = async (req: PdfUpload, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      res.status(400).json({ status: "error", message: "No file provided" });
      return;
    }

    const { path: filePath } = file;
    const result = await processFile(filePath);

    if (!result) {
      res.status(400).json({ status: "error", message: "Invalid PDF" });
      return;
    }

    // console.log("result ", result);
    req.pdfData = result;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
