"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIp = void 0;
const request_ip_1 = __importDefault(require("request-ip"));
function userIp() {
    return function userIp(req, res, next) {
        let userIp = request_ip_1.default.getClientIp(req);
        req.realIp = userIp;
        next();
    };
}
exports.userIp = userIp;
