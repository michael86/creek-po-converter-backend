import { RequestHandler } from "express";
import { validate } from "../middleware/validate";
import { body, param } from "express-validator";
import { fetchPrefixes, insertPrefix } from "../db/queries/parts";
import { checkUserRoleForAction } from "../middleware/checkUserRole";
import { addLog } from "../middleware/logs";
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
    .send({ token: req.headers.newToken, valid: !prefixes?.includes(prefix.toLowerCase()) });
};

const addPrefix: RequestHandler = async (req, res) => {
  try {
    const { prefix } = req.body;
    const inserted = await insertPrefix(prefix);

    if (!inserted) {
      res.status(400).send();
      return;
    }

    res.send({ token: req.headers.newToken, inserted });
  } catch (error) {
    console.error(error);
    res.status(400).send();
  }
};

router.get(
  "/prefix/is-valid/:prefix?",
  validate([param("prefix").trim().notEmpty().withMessage("prefix was empty").escape()]),
  checkUserRoleForAction(2),
  addLog("isPrefixValid"),
  isPrefixValid
);
router.put(
  "/prefix/add/",
  validate([body("prefix").trim().notEmpty().withMessage("prefix was empty").escape()]),
  checkUserRoleForAction(2),
  addLog("addPrefix"),
  addPrefix
);

module.exports = router;
