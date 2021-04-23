import { Router } from "express";

import authorize from "./authorize";
import token from "./token";
import verify from "./verify";
import revoke from "./revoke";

const router = Router();

router.use("/", authorize);
router.use("/token", token);
router.use("/verify", verify);
router.use("/revoke", revoke);

export default router;
