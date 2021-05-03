import { Router } from "express";

import { authorize } from "../middlewares/Authorize";
import { createPwdController } from "./lstpwd";

const router = Router();

router.post("/lstpwd/create", authorize(), (req, res) => {
	return createPwdController.handle(req, res);
});

export { router };
