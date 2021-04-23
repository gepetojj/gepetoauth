"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authorize_1 = __importDefault(require("./authorize"));
var token_1 = __importDefault(require("./token"));
var verify_1 = __importDefault(require("./verify"));
var revoke_1 = __importDefault(require("./revoke"));
var router = express_1.Router();
router.use("/", authorize_1.default);
router.use("/token", token_1.default);
router.use("/verify", verify_1.default);
router.use("/revoke", revoke_1.default);
exports.default = router;
