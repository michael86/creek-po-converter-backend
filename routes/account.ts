import { Request, Response } from "express";
const { selectEmail, createUser } = require("../sql/queries");
const sha256 = require("sha256");
const express = require("express");
const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
<<<<<<< HEAD
  try {
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
    if (!userCreated) throw new Error(`createUser: ${userCreated}`);
    res.send({ status: 1 });
  } catch (error) {
    console.log("registration error ", error);
=======
  let { email, password } = req.body.data;
  if (!email || !password || !email.includes("@creekviewelectronics.co.uk")) {
>>>>>>> 24ab32862e1dc26b59062530126ae77496b6346a
    res.send({ status: 0 });
  }
});
module.exports = router;
