"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const Authorize_1 = require("./useCases/Authorize");
const CreateUser_1 = require("./useCases/CreateUser");
const Login_1 = require("./useCases/Login");
const Verify_1 = require("./useCases/Verify");
const router = express_1.Router();
exports.router = router;
router.post("/register", (req, res) => {
    return CreateUser_1.createUserController.handle(req, res);
});
router.get("/login/authorize", (req, res) => {
    return Authorize_1.authorizeController.handle(req, res);
});
router.post("/login/authenticate", (req, res) => {
    return Login_1.loginController.handle(req, res);
});
router.get("/login/verify", (req, res) => {
    return Verify_1.verifyController.handle(req, res);
});
