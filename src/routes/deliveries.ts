import { Router } from "express";
import { validateDeliveryInformation } from "../middleware/deliveries";
import { addDeliveryToOrder } from "../controllers/deliveries";

const router = Router();

router.post("/add", validateDeliveryInformation, addDeliveryToOrder);

export default router;
