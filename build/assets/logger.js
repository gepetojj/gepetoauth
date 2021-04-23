"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pino_1 = __importDefault(require("pino"));
exports.default = pino_1.default({
    level: "debug",
    prettyPrint: {
        levelFirst: true,
        colorize: true,
    },
});
