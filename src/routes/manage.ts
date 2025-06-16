import { Router } from "express";
import { getUsers } from "../controllers/manage";

const router = Router();

router.get("/users", getUsers);

export default router;
