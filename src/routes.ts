import { Router } from "express";

import { createUserController } from "./useCases/CreateUser";
import { loginController } from "./useCases/Login";
import { refreshController } from "./useCases/Refresh";
import { verifyController } from "./useCases/Verify";

import { router as extensionsRouter } from "./extensions";

const router = Router();

router.post("/register", (req, res) => {
	return createUserController.handle(req, res);
});

router.post("/login/authenticate", (req, res) => {
	return loginController.handle(req, res);
});

router.get("/login/verify", (req, res) => {
	return verifyController.handle(req, res);
});

router.get("/login/refresh", (req, res) => {
	return refreshController.handle(req, res);
});

router.use("/ext", extensionsRouter);

export { router };
