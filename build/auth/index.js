"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var login_1 = __importDefault(require("./login"));
var register_1 = __importDefault(require("./register"));
var router = express_1.Router();
router.use("/login", login_1.default);
router.use("/register", register_1.default);
exports.default = router;
