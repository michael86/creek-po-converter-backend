import { Router } from "express";
import { addLocation, fetchAllLocations, updateLocation } from "../controllers/locations";
import { validateAddLocation, validateLocationUpdate } from "../middleware/locations";
import { validateUserRole } from "../middleware/auth";

const router = Router();

router.post("/update", validateLocationUpdate, updateLocation);
router.put("/add", validateUserRole([1, 3, 4]), validateAddLocation, addLocation);
router.get("/", fetchAllLocations);

export default router;
