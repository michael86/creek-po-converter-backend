import { Request, Response } from "express";
import { processFile } from "../utils/extract_pdf";
const { insertDataToDb, fetchPurchaseOrders, fetchPurchaseOrder } = require("../sql/queries");

const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: Function) => {
    cb(null, "public/pdf/");
  },
  filename: (req: Request, file: any, cb: Function) => {
    cb(null, file.originalname);
  },
});

interface MulterRequest extends Request {
  file: any;
}

const uploadStorage = multer({ storage: storage });

router.post(
  "/process",
  uploadStorage.single("pdf"),
  async function (req: MulterRequest, res: Response) {
    try {
      if (!req.file) throw new Error("no file fount");

      type Data = { DATA: []; ORDER_REFERENCE: string; PURCHASE_ORDER: string };

      processFile(req.file.filename, async (data: Data) => {
        if (!data) throw new Error("Failed to parse data from file");
        const inserted = await insertDataToDb(data);

        if (!inserted) throw new Error("failed to insert into database");

        res.send({ status: 1, token: req.headers.newToken });
      });
    } catch (err) {
      console.log(`Error Processing PDF`);
      res.status(500).send({ status: 2 });
    }
  }
);

router.get("/fetch/:id?", async (req: Request, res: Response) => {
  if (!req.params.id) {
    const purchaseOrders = await fetchPurchaseOrders();
    res.send({ status: 1, data: purchaseOrders, token: req.headers.newToken });
    return;
  }
  const purchaseOrder = await fetchPurchaseOrder(req.params.id);
  res.send({ status: 1, data: purchaseOrder, token: req.headers.newToken });
});
module.exports = router;
