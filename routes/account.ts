import { RequestHandler } from "express";
import { generateToken } from "../utils/tokens";
import { validate } from "../middleware/validate";
import { addLog } from "../middleware/logs";
import { body, param } from "express-validator";
import {
  selectEmail,
  createUser,
  validateLogin,
  validateUserToken,
  setTokenToNull,
  updateUserToken,
  getUserRole,
} from "../db/queries/user";

import { UserHeaders } from "@types_sql/index";

const sha256 = require("sha256");
const express = require("express");
const router = express.Router();

const handleRegister: RequestHandler = async (req, res) => {
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
    console.error("registration error ", error);
    res.send({ status: 0 });
  }
};

const handleLogin: RequestHandler = async (req, res) => {
  try {
    let { email, password } = req.body.data;

    if (!email || !password || !email.includes("@creekviewelectronics.co.uk")) {
      res.send({ status: 0 });
      return;
    }

    console.log("\x1b[31m", "--------------------------------------------------------");
    console.log("NEW LOGIN");

    console.log("\x1b[37m", "email: ", email);
    console.log("password: ", password.length);
    let user = await validateLogin(email);
    console.log("user: ", user);
    if (!user?.length) {
      res.send({ status: 2 });
      return;
    }

    if (sha256(password) !== user[0]) {
      console.log("password doesn't match");
      console.log("\x1b[31m", "END LOG IN");
      console.log("\x1b[31m", "--------------------------------------------------------");
      console.log("\x1b[37m", "");
      console.log("\x1b[0m", "");
      res.send({ status: 2 });
      return;
    }

    const token = generateToken();
    console.log("token: ", token);
    if (!token) throw new Error(`Failed to generate token ${token}`);

    const tokenStored = await updateUserToken(email, token);
    console.log("tokenStored: ", tokenStored);
    if (!tokenStored)
      throw new Error(`Failed to update user token on logging in %\n ${tokenStored}`);

    console.log("\x1b[31m", "END LOG IN");
    console.log("\x1b[31m", "--------------------------------------------------------");
    console.log("\x1b[37m", "");
    console.log("\x1b[0m", "");

    res.send({ status: 1, token, role: await getUserRole(email) });
  } catch (error) {
    console.error(error);
    res.send({ status: 0 });
  }
};

const validateToken: RequestHandler = async (req, res) => {
  const { token, email } = req.params;

  console.log("\x1b[31m", "--------------------------------------------------------");
  console.log("\x1b[31m", "New Token Validation");

  try {
    if (!token || !email) throw new Error(`validate token failed ${token}`);
    console.log("Token: ", token);
    console.log("email: ", email);
    const valid = await validateUserToken(email, token);
    console.log("valid: ", valid);
    if (!valid) {
      res.send({ valid });
      return;
    }

    console.log("\x1b[31m", "End Token Validation");
    console.log("\x1b[31m", "--------------------------------------------------------");
    res.send({ valid, role: await getUserRole(email) });
  } catch (error) {
    console.error("Error validating token ", error);
    res.send({ status: 0 });
  }
};

const handleLogout: RequestHandler = async (req, res) => {
  const { token, email } = req.headers as UserHeaders;

  console.log("\x1b[31m", "--------------------------------------------------------");
  console.log("\x1b[31m", "New Log Out");

  try {
    if (!token || !email)
      throw new Error(`Failed to log out user \n TOKEN: ${token}\n EMAIL: ${email}`);

    const loggedout = await setTokenToNull(email, token);
    console.log("logged out: ", loggedout);
    if (!loggedout) throw new Error(`Failed to log out user ${loggedout}`);

    console.log("\x1b[31m", "End Log Out");
    console.log("\x1b[31m", "--------------------------------------------------------");
    res.send({ status: 1 });
  } catch (error) {
    console.error(error);
    res.send({ status: 0 });
  }
};

router.post(
  "/register",
  validate([
    body("data.email").trim().notEmpty().isEmail().normalizeEmail(),
    body("data.password").trim().notEmpty(),
  ]),
  // addLog(""),
  handleRegister
);

router.post(
  "/login",
  validate([
    body("data.email").trim().notEmpty().isEmail().normalizeEmail(),
    body("data.password").trim().notEmpty(),
  ]),
  addLog("login"),
  handleLogin
);

router.get(
  "/validate-token/:token?/:email?",
  validate([
    param("email")
      .trim()
      .notEmpty()
      .withMessage("email empty")
      .isEmail()
      .withMessage("Not valid email")
      .normalizeEmail(),
  ]),
  addLog("validateToken"),
  validateToken
);
router.post("/logout", addLog("logout"), handleLogout);
module.exports = router;
