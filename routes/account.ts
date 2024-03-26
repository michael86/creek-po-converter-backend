import { RequestHandler } from "express";
import { generateToken } from "../utils/tokens";

const {
  selectEmail,
  createUser,
  validateLogin,
  validateUserToken,
  setTokenToNull,
  updateUserToken,
} = require("../sql/queries");

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
    console.log("registration error ", error);
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

    const tokenStored = await updateUserToken(email, token);
    if (!tokenStored)
      throw new Error(`Failed to update user token on logging in %\n ${tokenStored}`);

    res.send({ status: 1, token });
  } catch (error) {
    console.log("Log in error ", error);
    res.send({ status: 0 });
  }
};

const validateToken: RequestHandler = async (req, res) => {
  const { token, email } = req.params;
  try {
    if (!token || !email) throw new Error(`validate token failed ${token}`);
    res.send({ valid: await validateUserToken(email, token) });
  } catch (error) {
    console.log("Error validating token ", error);
    res.send({ status: 0 });
  }
};

const handleLogout: RequestHandler = async (req, res) => {
  const { token, email } = req.headers;

  try {
    if (!token || !email)
      throw new Error(`Failed to log out user \n TOKEN: ${token}\n EMAIL: ${email}`);

    const loggedout = await setTokenToNull(email, token);
    if (!loggedout) throw new Error(`Failed to log out user ${loggedout}`);

    res.send({ status: 1 });
  } catch (error) {
    console.log(error);
    res.send({ status: 0 });
  }
};

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/validate-token/:token?/:email?", validateToken);
router.post("/logout", handleLogout);
module.exports = router;
