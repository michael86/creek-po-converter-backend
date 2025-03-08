import multer from "multer";
const upload = multer({ dest: "uploads/" });

import { Router } from "express";
import { validatePDF } from "../middleware/pdf";
import { insertPdf } from "../controllers/pdf";

const route = Router();

route.post("/upload", upload.single("file"), validatePDF, insertPdf);

export default route;
