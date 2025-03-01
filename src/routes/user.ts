import { Router } from "express";
import { handleLogin } from "../controllers/user";
import { validateUser } from "../middleware/user";

const route = Router();

route.post("/login", validateUser("login"), handleLogin);
route.post("/register", validateUser("register"), handleLogin);

export default route;
