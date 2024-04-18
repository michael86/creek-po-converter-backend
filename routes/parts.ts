import { RequestHandler } from "express";
const { fetchPrefixes } = require("../sql/queries");
const express = require("express");
export const router = express.Router();

const isPrefixValid: RequestHandler = async (req, res) => {
  const { prefix } = req.params;
  if (!prefix) {
    res.status(400).send({ token: req.headers.newToken });
  }

  const prefixes = await fetchPrefixes();
  if (!prefix.length) {
    res.status(500).send({ token: req.headers.newToken });
    return;
  }

  res
    .status(200)
    .send({ token: req.headers.newToken, valid: !prefixes.includes(prefix.toLowerCase()) });
};

router.get("/prefix/is-valid/:prefix?", isPrefixValid);

module.exports = router;
