import { Request, Response } from "express";
const { selectEmail, createUser } = require("../sql/queries");
const sha256 = require("sha256");
const express = require("express");
const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  let { email, password } = req.body.data;
  if (!email || !password || !email.includes("@creekviewelectronics.co.uk")) {
    res.send({ status: 0 });
    return;
  }

  const emailUsed = await selectEmail(email);
  if (emailUsed) {
    res.send({ status: 2 });
    return;
  }

  password = sha256(password);

  const userCreated = await createUser(email, password);
  console.log("userCreated ", userCreated);
  res.send({ status: 1 });
});
module.exports = router;
