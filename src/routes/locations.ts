import { Router } from "express";
import { fetchAllLocations } from "../controllers/locations";
import { validateLocationUpdate } from "../middleware/locations";

const router = Router();

router.post("/update", validateLocationUpdate);
router.get("/", fetchAllLocations);

export default router;
