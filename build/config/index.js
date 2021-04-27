"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const envExists = dotenv_1.default.config();
if (envExists.error) {
    throw new Error("Environment variables not found.");
}
exports.default = {
    dev: process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "test"
        ? true
        : false,
    test: process.env.NODE_ENV === "test" ? true : false,
    port: Number(process.env.PORT),
    srcPath: `${__dirname}/src`,
    // Firebase config
    pkid: String(process.env.PKID),
    pk: String(process.env.PK.replace(/\\n/g, "\n")),
    ce: String(process.env.CE),
    cid: String(process.env.CID),
    curl: String(process.env.CURL),
    // Mail providers config
    mailtrapUser: String(process.env.MAILTRAP_USER),
    mailtrapPass: String(process.env.MAILTRAP_PASS),
    mailgunUser: String(process.env.MAILGUN_USER),
    mailgunPass: String(process.env.MAILGUN_PASS),
    cookieSecret: String(process.env.COOKIE_SECRET),
    accessTokenSecret: String(process.env.ACCESS_TOKEN_SECRET),
};
