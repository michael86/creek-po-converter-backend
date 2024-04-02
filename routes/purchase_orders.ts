import { RequestHandler } from "express";

const express = require("express");
const router = express.router();

const updatePartNumber: RequestHandler = (req, res) => {};

router.update("partnumber", updatePartNumber);
