import { Router } from "express";
import { addPrefix } from "../controllers/prefixes";
import { validateUserRole } from "../middleware/auth";
import { validateAddPrefix } from "../middleware/prefixes";

const router = Router();

router.put("/add", validateUserRole([1, 3, 4]), validateAddPrefix, addPrefix);

export default router;
