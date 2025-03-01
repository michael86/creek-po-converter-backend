import { Router } from "express";
import { handleMe } from "../controllers/auth";
import { validateMe } from "../middleware/auth";

const route = Router();

route.get("/me", validateMe, handleMe);

export default route;
