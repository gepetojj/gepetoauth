import { Router } from "express";

import { authorize } from "../middlewares/Authorize";
import {
	createPwdController,
	deletePwdController,
	getAllPwdsController,
} from "./lstpwd";

const router = Router();

router.post("/lstpwd/create", authorize(), (req, res) => {
	return createPwdController.handle(req, res);
});

router.delete("/lstpwd/delete", authorize(), (req, res) => {
	return deletePwdController.handle(req, res);
});

router.get("/lstpwd/passwords", authorize(), (req, res) => {
	return getAllPwdsController.handle(req, res);
});

export { router };
