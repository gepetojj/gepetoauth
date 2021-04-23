import { Router } from "express";

import register from "./register";

const router = Router();

router.use("/", register);

export default router;
