"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.verifyAccessToken = exports.createAccessToken = exports.createId = void 0;
require("dotenv").config();
var jws_1 = __importDefault(require("jws"));
var dayjs_1 = __importDefault(require("dayjs"));
var utc_1 = __importDefault(require("dayjs/plugin/utc"));
var timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.tz.setDefault("America/Maceio");
var accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "";
function createId() {
    var base = "1234567890";
    var output = "";
    var baseLength = base.length;
    for (var count = 0; count < 14; count++) {
        output += base.charAt(Math.floor(Math.random() * baseLength));
    }
    return output;
}
exports.createId = createId;
function createAccessToken(payload) {
    var tokenPayload = {
        tokenId: createId(),
        validUntil: dayjs_1.default().add(15, "minutes").valueOf(),
        payload: payload,
    };
    var signature = jws_1.default.sign({
        header: { alg: "HS256" },
        payload: tokenPayload,
        secret: accessTokenSecret,
        encoding: "utf8",
    });
    return signature;
}
exports.createAccessToken = createAccessToken;
function verifyAccessToken(accessToken) {
    var isValid = jws_1.default.verify(accessToken, "HS256", accessTokenSecret);
    if (isValid) {
        var accessTokenPayload = jws_1.default.decode(accessToken).payload;
        var now = dayjs_1.default().valueOf();
        if (now > accessTokenPayload.validUntil) {
            return { valid: false };
        }
        return { valid: true, payload: accessTokenPayload };
    }
    return { valid: false };
}
exports.verifyAccessToken = verifyAccessToken;
function createRefreshToken() {
    var base = "12345678901234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var output = "";
    var baseLength = base.length;
    for (var count = 0; count < 32; count++) {
        output += base.charAt(Math.floor(Math.random() * baseLength));
    }
    return output;
}
exports.createRefreshToken = createRefreshToken;
