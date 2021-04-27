"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.verifyAccessToken = exports.createAccessToken = exports.createId = void 0;
const jws_1 = __importDefault(require("jws"));
const config_1 = __importDefault(require("../config"));
const DayjsLoader_1 = require("../loaders/DayjsLoader");
const dayjs = new DayjsLoader_1.DayjsLoader().execute();
function createId() {
    const base = "1234567890";
    let output = "";
    const baseLength = base.length;
    for (let count = 0; count < 14; count++) {
        output += base.charAt(Math.floor(Math.random() * baseLength));
    }
    return output;
}
exports.createId = createId;
function createAccessToken(payload) {
    const tokenPayload = {
        id: createId(),
        validUntil: dayjs().add(15, "minutes").valueOf(),
        payload,
    };
    const signature = jws_1.default.sign({
        header: { alg: "HS256" },
        payload: tokenPayload,
        secret: config_1.default.accessTokenSecret,
        encoding: "utf8",
    });
    return signature;
}
exports.createAccessToken = createAccessToken;
function verifyAccessToken(accessToken) {
    const isValid = jws_1.default.verify(accessToken, "HS256", config_1.default.accessTokenSecret);
    if (isValid) {
        const accessTokenPayload = JSON.parse(jws_1.default.decode(accessToken).payload);
        const accessTokenFormatted = {
            id: accessTokenPayload.id,
            validUntil: accessTokenPayload.validUntil,
            payload: accessTokenPayload.payload,
        };
        const now = dayjs().valueOf();
        if (now > accessTokenPayload.validUntil) {
            return { valid: false };
        }
        return { valid: true, payload: accessTokenFormatted };
    }
    return { valid: false };
}
exports.verifyAccessToken = verifyAccessToken;
function createRefreshToken() {
    const base = "12345678901234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let output = "";
    const baseLength = base.length;
    for (let count = 0; count < 32; count++) {
        output += base.charAt(Math.floor(Math.random() * baseLength));
    }
    return output;
}
exports.createRefreshToken = createRefreshToken;
