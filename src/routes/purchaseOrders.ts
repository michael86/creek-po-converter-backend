import { Router } from "express";
import { deletePurchaseOrder } from "../controllers/purchaseOrders";
import { validateDeleteParam } from "../middleware/purchaseOrders";

const router = Router();

router.delete("/delete/:id", validateDeleteParam, deletePurchaseOrder);

export default router;
