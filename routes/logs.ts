import { selectLogs } from "../db/queries/logs";
import { RequestHandler } from "express";
import { checkUserRoleForAction } from "../middleware/checkUserRole";

const express = require("express");
const router = express.Router();

const returnLogs: RequestHandler = async (req, res) => {
  try {
    const logs = await selectLogs();
    if (!logs?.length) res.status(500).send({ token: req.headers.newToken });

    res.send({ token: req.headers.newToken, logs });
  } catch (error) {
    console.error(error);
    res.status(500).send({ token: req.headers.newToken });
  }
};

router.get("/", checkUserRoleForAction(5), returnLogs);

module.exports = router;
