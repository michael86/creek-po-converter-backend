require("dotenv").config();
const pdf2table = require("pdf2table");
const fs = require("fs/promises");
const path = require("path");

import { Request, RequestHandler } from "express";
import { processFile } from "../utils/extract_pdf";
import { insertOrderToDb, fetchPurchaseOrders, fetchPurchaseOrder } from "../db/queries/orders";
import { validate } from "../middleware/validate";
import { param } from "express-validator";
import { addLog } from "../middleware/logs";
import { isArray } from "util";

const pdfFolder = path.resolve(__dirname, "../public/pdf");

const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, process.env.DEVELOPMENT_MODE ? "dist/public/pdf/" : "public/pdf/");
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, file.originalname);
  },
});

const uploadStorage = multer({ storage: storage });

const beginProcess: RequestHandler = async (req, res) => {
  try {
    if (!req.file) throw new Error("no file fount");

    type Data = { DATA: []; ORDER_REFERENCE: string; PURCHASE_ORDER: string };

    processFile(req.file.filename, async (data: Data) => {
      if (!data) {
        res.send({ status: 3, token: req.headers.newToken });

        return;
      }

      const inserted = await insertOrderToDb(data);

      if (inserted === "ER_DUP_ENTRY") {
        res.send({ status: 4, token: req.headers.newToken });
        return;
      }

      if (!inserted) {
        console.error(`Error Processing PDF (inserted) ${inserted}`);
        res.status(500).send({ status: 2 });
        return;
      }

      res.send({ status: 1, token: req.headers.newToken });
    });
  } catch (err) {
    console.error(`Error Processing PDF (err) ${err}`);
    res.status(500).send({ status: 2 });
  }
};

const fetch: RequestHandler = async (req, res) => {
  if (!req.params.id) {
    const purchaseOrders = await fetchPurchaseOrders();

    if (!purchaseOrders) {
      res.send({ status: 0 });
      return;
    }

    res.send({
      status: 1,
      data: purchaseOrders,
      token: req.headers.newToken,
    });
    return;
  }

  const purchaseOrder = await fetchPurchaseOrder(req.params.id);
  res.send({ status: 1, data: purchaseOrder, token: req.headers.newToken });
};

const extractStickerTemplate: RequestHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ status: 0, message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    const fileData: string = await fs.readFile(path.resolve(pdfFolder, fileName));

    const data = await pdf2table.parse(fileData, (err: string, rows: any[]) => {
      if (err) {
        console.error(`Error parsing PDF: ${err}`);
        return res
          .status(500)
          .send({ status: 0, message: "Error processing PDF", token: req.headers.newToken });
      }

      /** Need to extract the following data from the rows:
       1. 'Order reference:'
       2. 'Part Number'
       3. 'Qty'
     
      table row starts with    ['Line',
      "Our part number",
        "Issue",
        "Your part number",
        "Units",
        "Unit net GBP price",
        "Due quantity",
        "Net GBP value"];
      
        part rows always start with a number after the table row and has 6 indexes
      */
      const orderReferenceRow = rows.find((row) =>
        row.some((cell: string) => cell.toLowerCase().includes("order reference:"))
      );
      const ORDER_REFERENCE: string = orderReferenceRow[3];

      const tableRowIndex = rows.findIndex(
        (row) =>
          row.length === 8 &&
          row[0].toLowerCase() === "line" &&
          row[1].toLowerCase() === "our part number"
      );

      const tableRows = rows.slice(tableRowIndex + 1);

      tableRows.map((row) => {
        if (!isNaN(+row[0])) {
          return row;
        }
      });

      console.log(`Extracted tableRows: ${tableRows}`);
    });

    return res.send({
      status: 1,
      message: "Sticker template processed successfully",
      token: req.headers.newToken,
    });
  } catch (err) {
    console.error(`Error Processing PDF (err) ${err}`);
    res.status(500).send({ status: 2 });
  }
};

router.post(
  "/process-sticker-template",
  uploadStorage.single("pdf"),
  addLog("fileUpload"),
  extractStickerTemplate
);

router.post("/process", uploadStorage.single("pdf"), addLog("fileUpload"), beginProcess);
router.get("/fetch/:id?", validate([param("id").trim()]), addLog("fetchPo"), fetch);

module.exports = router;
