import { Router } from "express";
import {
  deletePurchaseOrder,
  handleNames,
  selectPurchaseOrder,
  setThreshold,
  updateLocation,
} from "../controllers/purchaseOrders";
import {
  validateDeleteParam,
  validateThreshold,
  validateUpdateLocation,
} from "../middleware/purchaseOrders";

const router = Router();

router.put("/order-items/:uuid/threshold", validateThreshold, setThreshold);
router.delete("/delete/:id", validateDeleteParam, deletePurchaseOrder);
router.get("/names", handleNames);
router.put("/:uuid/items/:partNumber", validateUpdateLocation, updateLocation);
router.get("/:uuid", selectPurchaseOrder);

export default router;
