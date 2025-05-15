import { Request } from "express";

export interface PdfUpload extends Request {
  file?: Express.Multer.File;
  pdfData?: ParsedPdf;
}

export interface PdfData {
  Pages?: {
    Texts: {
      R: { T: string }[];
    }[];
  }[];
}

export type Part = { partNumber: string; quantity: number; dueDate: Date; description: string };

export type PurchaseOrderData = Part[];

export type ParsedPdf = { data: PurchaseOrderData; purchaseOrder: string; orderRef: string } | null;
