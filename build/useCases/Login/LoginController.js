"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const response_1 = __importDefault(require("../../utils/response"));
const LoggerLoader_1 = __importDefault(require("../../loaders/LoggerLoader"));
const validators_1 = require("../../utils/validators");
class LoginController {
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }
    async handle(req, res) {
        var _a, _b, _c, _d, _e;
        try {
            let { username, password } = req.body;
            let code = String(req.query.code);
            const agent = `${(_a = req.useragent) === null || _a === void 0 ? void 0 : _a.browser} ${(_b = req.useragent) === null || _b === void 0 ? void 0 : _b.version} ${(_c = req.useragent) === null || _c === void 0 ? void 0 : _c.os} ${(_d = req.useragent) === null || _d === void 0 ? void 0 : _d.platform} ${(_e = req.useragent) === null || _e === void 0 ? void 0 : _e.source}`;
            const ip = req.realIp;
            const usernameValidation = validators_1.validateUsername(username);
            const passwordValidation = validators_1.validatePassword(password);
            const codeValidation = validators_1.validateCode(code);
            if (usernameValidation.error ||
                passwordValidation.error ||
                codeValidation.error) {
                return res.status(400).json(response_1.default(true, "invaliddata", {
                    errors: usernameValidation.message ||
                        passwordValidation.message ||
                        codeValidation.message,
                }));
            }
            username = usernameValidation.value;
            password = passwordValidation.value;
            code = codeValidation.value;
            const { accessToken, refreshToken, } = await this.loginUseCase.execute({
                username,
                password,
                code,
                agent,
                ip,
            });
            return res.json(response_1.default(false, "authorized", { accessToken, refreshToken }));
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            return res
                .status(500)
                .json(response_1.default(false, "databaseerror", { stack: err.message }));
        }
    }
}
exports.LoginController = LoginController;
