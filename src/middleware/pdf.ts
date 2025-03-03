import { RequestHandler } from "express";
import { PdfUpload } from "../types/pdf";
import path from "path";
import fs from "fs/promises";
import pdfParse from "pdf-parse";
import { extractDataFromPDF, extractPurchaseAndOrderRef, extractTableData } from "../utils/pdf";

const UPLOADS = path.resolve(__dirname, "../uploads");

export const validatePDF: RequestHandler = async (req: PdfUpload, res, next) => {
  try {
    const { file } = req;

    if (!file) {
      res.status(400).json({ status: "error", message: "No file provided" });
      return;
    }

    const { path: filePath } = file;

    const pdfBuffer = await fs.readFile(filePath);
    const parsed = await pdfParse(pdfBuffer);

    const data = await extractDataFromPDF(parsed.text.split("\n").map((line) => line.trim()));

    console.log("data ", data);
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
    return;
  }
};
