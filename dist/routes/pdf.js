"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
const express_1 = require("express");
const pdf_1 = require("../middleware/pdf");
const pdf_2 = require("../controllers/pdf");
const route = (0, express_1.Router)();
route.post("/upload", upload.single("file"), pdf_1.validatePDF, pdf_2.insertPdf);
exports.default = route;
