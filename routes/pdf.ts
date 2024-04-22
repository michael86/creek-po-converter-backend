import { Request, RequestHandler } from "express";
import { processFile } from "../utils/extract_pdf";
import { insertDataToDb, fetchPurchaseOrders, fetchPurchaseOrder } from "../db/queries/orders";
require("dotenv").config();

const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, process.env.SQL_PORT ? "dist/public/pdf/" : "public/pdf/");
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

      const inserted = await insertDataToDb(data);

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

router.post("/process", uploadStorage.single("pdf"), beginProcess);
router.get("/fetch/:id?", fetch);
module.exports = router;
