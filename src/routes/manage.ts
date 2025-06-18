import { Router } from "express";
import { getUsers, updateRole } from "../controllers/manage";
import { updateUserRoleValidation } from "../middleware/manage";

const router = Router();

router.put("/users/update-role/:id", updateUserRoleValidation, updateRole);
router.get("/users", getUsers);

export default router;
