import { Request, Response } from "express";
const { selectEmail, createUser, validateLogin, validateUserToken } = require("../sql/queries");
import { generateToken } from "../utils/tokens";

const sha256 = require("sha256");
const express = require("express");
const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
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
    res.send({ status: 1, token: userCreated });
  } catch (error) {
    console.log("registration error ", error);
    res.send({ status: 0 });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body.data;

    if (!email || !password || !email.includes("@creekviewelectronics.co.uk")) {
      console.log("not valid");
      res.send({ status: 0 });
      return;
    }

    let user = await validateLogin(email);

    if (!user.length) {
      res.send({ status: 2 });
      return;
    }

    user = user[0];
    if (sha256(password) !== user.password) {
      res.send({ status: 2 });
      return;
    }

    const token = generateToken();
    if (!token) throw new Error(`Failed to generate token ${token}`);

    // const tokenStored = await storeToken(token, user.id);

    res.send({ status: 1 });
  } catch (error) {
    console.log("Log in error ", error);
    res.send({ status: 0 });
  }
});

router.get("/validate-token/:token?/:email?", async (req: Request, res: Response) => {
  const { token, email } = req.params;
  try {
    if (!token || !email) throw new Error(`validate token failed ${token}`);
    res.send({ valid: await validateUserToken(email, token) });
  } catch (error) {
    console.log("Error validating token ", error);
    res.send({ status: 0 });
  }
});

module.exports = router;
