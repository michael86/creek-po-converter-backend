import { Router } from "express";
import {
  deletePurchaseOrder,
  handleNames,
  selectPurchaseOrder,
  updateLocation,
} from "../controllers/purchaseOrders";
import { validateDeleteParam, validateUpdateLocation } from "../middleware/purchaseOrders";

const router = Router();

router.delete("/delete/:id", validateDeleteParam, deletePurchaseOrder);
router.get("/names", handleNames);
router.put("/:uuid/items/:partNumber", validateUpdateLocation, updateLocation);
router.get("/:uuid", selectPurchaseOrder);

export default router;
