import { Router } from "express";
import { handleMe } from "../controllers/auth";
import { validateMe, validateUserRole } from "../middleware/auth";

const route = Router();

route.get("/me", validateMe, handleMe);
route.get("/role/:key", validateMe, validateUserRole, handleMe);

export default route;
