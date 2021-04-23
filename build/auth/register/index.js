"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var register_1 = __importDefault(require("./register"));
var router = express_1.Router();
router.use("/", register_1.default);
exports.default = router;
