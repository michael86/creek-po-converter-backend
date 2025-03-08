import { Router } from "express";
import { deletePurchaseOrder, handleNames } from "../controllers/purchaseOrders";
import { validateDeleteParam } from "../middleware/purchaseOrders";

const router = Router();

router.delete("/delete/:id", validateDeleteParam, deletePurchaseOrder);
router.get("/names", handleNames);
router.get("/:uuid");

export default router;
