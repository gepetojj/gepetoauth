"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var express_1 = __importDefault(require("express"));
var dayjs_1 = __importDefault(require("dayjs"));
var utc_1 = __importDefault(require("dayjs/plugin/utc"));
var timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
var body_parser_1 = require("body-parser");
var compression_1 = __importDefault(require("compression"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var cors_1 = __importDefault(require("cors"));
var express_enforces_ssl_1 = __importDefault(require("express-enforces-ssl"));
var helmet_1 = __importDefault(require("helmet"));
var pino_http_1 = __importDefault(require("pino-http"));
var middlewares_1 = require("./assets/middlewares");
var logger_1 = __importDefault(require("./assets/logger"));
var auth_1 = __importDefault(require("./auth"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.tz.setDefault("America/Maceio");
var app = express_1.default();
var port = Number(process.env.PORT);
var dev = process.env.NODE_ENV === "development" ? true : false;
if (!dev) {
    app.enable("trust proxy");
    app.use(express_enforces_ssl_1.default());
}
if (dev) {
    app.use(pino_http_1.default({ logger: logger_1.default }));
}
app.use(middlewares_1.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
}));
app.use(helmet_1.default({
    hsts: false,
}));
app.use(cors_1.default({
    origin: "*",
}));
app.use(compression_1.default());
app.use(middlewares_1.userIp());
app.use(body_parser_1.urlencoded({ extended: false }));
app.use(body_parser_1.json());
app.use(cookie_session_1.default({
    secret: process.env.COOKIE_SECRET,
    expires: dayjs_1.default().add(1, "day").toDate(),
    secure: !dev,
    httpOnly: true,
    signed: true,
    sameSite: "lax",
}));
app.use("/", auth_1.default);
app.use(function (req, res) {
    return res.status(404).json({
        error: true,
        message: "Este endpoint com esse método não foi encontrado.",
        method: req.method,
        endpoint: req.path,
    });
});
app.listen(port, "0.0.0.0", function () {
    logger_1.default.info("[" + dayjs_1.default().format("hh:mm:ssa DD/MM/YYYY") + "] O servidor esta online.");
});
