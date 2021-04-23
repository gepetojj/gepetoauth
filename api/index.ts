import { Router } from "express";

import login from "./login";
import register from "./register";
import admin from "./admin";

const router = Router();

router.use("/login", login);
router.use("/register", register);
router.use("/admin", admin);

export default router;
