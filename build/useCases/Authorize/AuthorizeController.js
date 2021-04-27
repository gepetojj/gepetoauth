"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeController = void 0;
const response_1 = __importDefault(require("../../utils/response"));
const LoggerLoader_1 = __importDefault(require("../../loaders/LoggerLoader"));
class AuthorizeController {
    constructor(authorizeUseCase) {
        this.authorizeUseCase = authorizeUseCase;
    }
    async handle(req, res) {
        var _a, _b, _c, _d, _e;
        try {
            const agent = `${(_a = req.useragent) === null || _a === void 0 ? void 0 : _a.browser} ${(_b = req.useragent) === null || _b === void 0 ? void 0 : _b.version} ${(_c = req.useragent) === null || _c === void 0 ? void 0 : _c.os} ${(_d = req.useragent) === null || _d === void 0 ? void 0 : _d.platform} ${(_e = req.useragent) === null || _e === void 0 ? void 0 : _e.source}`;
            const ip = req.realIp;
            const code = await this.authorizeUseCase.execute({ ip, agent });
            return res.json(response_1.default(false, "authorized", { code }));
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            return res
                .status(500)
                .json(response_1.default(false, "databaseerror", { stack: err.message }));
        }
    }
}
exports.AuthorizeController = AuthorizeController;
