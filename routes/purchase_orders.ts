import { RequestHandler } from "express";
const { patchPartialStatus } = require("../sql/queries");

const express = require("express");
const router = express.Router();

const updatePartNumber: RequestHandler = async (req, res) => {
  try {
    const { order, name } = req.params;
    const result = await patchPartialStatus(order, name);
    if (!result) throw new Error(result);

    res.send({ status: 1, token: req.headers.newToken });
  } catch (error) {
    console.error(`error setting part_number to partial parcel: ${error}`);
    res.status(500).send({ status: 0 });
  }
};

router.patch("/set-partial/:order?/:name?", updatePartNumber);
module.exports = router;
