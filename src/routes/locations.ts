import { Router } from "express";
import { fetchAllLocations } from "../controllers/locations";

const router = Router();

router.get("/", fetchAllLocations);

export default router;
