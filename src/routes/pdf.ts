import { Router } from "express";
import { validatePDF } from "../middleware/pdf";
import { insertPdf } from "../controllers/pdf";

const route = Router();

route.post("/upload", validatePDF, insertPdf);

export default route;
