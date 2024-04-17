import { RequestHandler } from "express";
const express = require("express");
export const router = express.Router();

const isPrefixValid: RequestHandler = async (req, res) => {
  const { prefix } = req.params;
  if (!prefix) {
    res.status(400).send({ token: req.headers.newToken });
  }
  res.status(200).send({ token: req.headers.newToken });
  console.log(req.params);
};

router.get("/prefix/is-valid/:prefix?", isPrefixValid);

module.exports = router;
