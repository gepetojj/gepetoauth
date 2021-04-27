"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressLoader = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const compression_1 = __importDefault(require("compression"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const cors_1 = __importDefault(require("cors"));
const express_enforces_ssl_1 = __importDefault(require("express-enforces-ssl"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const helmet_1 = __importDefault(require("helmet"));
const pino_http_1 = __importDefault(require("pino-http"));
const routes_1 = require("../routes");
const DayjsLoader_1 = require("./DayjsLoader");
const Hsts_1 = require("../middlewares/Hsts");
const Ip_1 = require("../middlewares/Ip");
const config_1 = __importDefault(require("../config"));
const LoggerLoader_1 = __importDefault(require("./LoggerLoader"));
const response_1 = __importDefault(require("../utils/response"));
class ExpressLoader {
    execute() {
        const app = express_1.default();
        const dayjs = new DayjsLoader_1.DayjsLoader().execute();
        if (!config_1.default.dev) {
            app.enable("trust proxy");
            app.use(express_enforces_ssl_1.default());
        }
        else {
            if (!config_1.default.test) {
                app.use(pino_http_1.default({ logger: LoggerLoader_1.default }));
            }
        }
        app.use(Hsts_1.hsts({
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        }));
        app.use(helmet_1.default({
            hsts: false,
            contentSecurityPolicy: {
                directives: Object.assign(Object.assign({}, helmet_1.default.contentSecurityPolicy.getDefaultDirectives()), { "img-src": ["data:", "'self'", "https:"] }),
            },
        }));
        app.use(cors_1.default({
            origin: "*",
        }));
        app.use(compression_1.default());
        app.use(Ip_1.userIp());
        app.use(express_useragent_1.default.express());
        app.use(body_parser_1.urlencoded({ extended: false }));
        app.use(body_parser_1.json());
        app.use(cookie_session_1.default({
            secret: config_1.default.cookieSecret,
            expires: dayjs().add(1, "day").toDate(),
            secure: !config_1.default.dev,
            httpOnly: true,
            signed: true,
            sameSite: "lax",
        }));
        app.use("/", routes_1.router);
        app.use("/static", express_1.default.static("src/static"));
        app.use((req, res) => {
            return res.status(404).json(response_1.default(true, "invalidendpoint", {
                endpoint: req.url,
                method: req.method,
            }));
        });
        return app;
    }
}
exports.ExpressLoader = ExpressLoader;
