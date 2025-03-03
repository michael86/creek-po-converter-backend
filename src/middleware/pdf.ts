import { RequestHandler } from "express";
import { PdfUpload } from "src/types/pdf";
import path from "path";
import fs from "fs/promises";

const UPLOADS = path.resolve(__dirname, "../uploads");

export const validatePDF: RequestHandler = async (req: PdfUpload, res, next) => {
  const { file } = req;

  if (!file) {
    res.status(400).json({ status: "error", message: "No file provided" });
    return;
  }

  const { path: filePath } = file;

  const fileData = await fs.readFile(path.resolve(UPLOADS, filePath));

  next();
};
