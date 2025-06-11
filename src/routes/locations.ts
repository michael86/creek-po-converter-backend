import { Router } from "express";
import { fetchAllLocations, updateLocation } from "../controllers/locations";
import { validateLocationUpdate } from "../middleware/locations";

const router = Router();

router.post("/update", validateLocationUpdate, updateLocation);
router.get("/", fetchAllLocations);

export default router;
