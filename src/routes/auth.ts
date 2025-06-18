import { Router } from "express";
import { handleMe } from "../controllers/auth";
import { validateMe, validateUserRole } from "../middleware/auth";

const route = Router();

route.get("/me", validateMe, handleMe);
route.get("/role", validateMe, validateUserRole([1, 2, 3, 4, 5, 6]), handleMe);

export default route;
