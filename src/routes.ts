import { Router } from "express";

import { authorizeController } from "./useCases/Authorize";
import { createUserController } from "./useCases/CreateUser";
import { loginController } from "./useCases/Login";

const router = Router();

router.post("/register", (req, res) => {
	return createUserController.handle(req, res);
});

router.get("/login/authorize", (req, res) => {
	return authorizeController.handle(req, res);
});

router.post("/login/authenticate", (req, res) => {
	return loginController.handle(req, res);
});

export { router };
