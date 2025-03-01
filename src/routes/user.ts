import { Router } from "express";
import { handleLogin, handleRegister } from "../controllers/user";
import { validateUser } from "../middleware/user";

const route = Router();

route.post("/login", validateUser("login"), handleLogin);
route.post("/register", validateUser("register"), handleRegister);

export default route;
