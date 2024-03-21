import { Request, Response } from "express";
import { processFile } from "../modules/extract_pdf";
const { insertDataToDb } = require("../sql/queries");

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
        console.log("data ", data);
        if (!data) throw new Error("Failed to parse data from file");

        // console.log(`PO: \x1b[31m${data.PURCHASE_ORDER}\x1b[37m`);
        // console.log(`Order REf: \x1b[31m${data.ORDER_REFERENCE}\x1b[37m`);

        // data.DATA.forEach((entry) => {
        //   console.log(`Sku: \x1b[31m${entry[0]} | QTY: \x1b[31m${entry[1]}\x1b[37m`);
        // });

        const inserted = await insertDataToDb(data);

        if (!inserted) throw new Error("failed to insert into database");

        res.send({ status: 1 });
      });
    } catch (err) {
      console.log(`Error Processing PDF`);
      res.status(500).send({ status: 2 });
    }
  }
);

module.exports = router;
