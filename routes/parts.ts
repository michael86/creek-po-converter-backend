import { RequestHandler } from "express";
import { validate } from "../middleware/validate";
import { body } from "express-validator";
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

const addPrefix: RequestHandler = (req, res) => {
  console.log(req.body.prefix);
  res.send({ token: req.headers.newToken });
};

router.get("/prefix/is-valid/:prefix?", isPrefixValid);
router.put(
  "/prefix/add/",
  validate([body("prefix").trim().notEmpty().withMessage("prefix was empty").escape()]),
  addPrefix
);

module.exports = router;
