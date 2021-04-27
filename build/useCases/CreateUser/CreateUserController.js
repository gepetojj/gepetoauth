"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const validators_1 = require("../../utils/validators");
const response_1 = __importDefault(require("../../utils/response"));
class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }
    async handle(req, res) {
        var _a, _b, _c, _d, _e;
        let { username, email, password } = req.body;
        const agent = `${(_a = req.useragent) === null || _a === void 0 ? void 0 : _a.browser} ${(_b = req.useragent) === null || _b === void 0 ? void 0 : _b.version} ${(_c = req.useragent) === null || _c === void 0 ? void 0 : _c.os} ${(_d = req.useragent) === null || _d === void 0 ? void 0 : _d.platform} ${(_e = req.useragent) === null || _e === void 0 ? void 0 : _e.source}`;
        const ip = req.realIp;
        const usernameValidation = validators_1.validateUsername(username);
        const emailValidation = validators_1.validateEmail(email);
        const passwordValidation = validators_1.validatePassword(password);
        if (usernameValidation.error ||
            emailValidation.error ||
            passwordValidation.error) {
            return res.status(400).json(response_1.default(true, "invaliddata", {
                errors: usernameValidation.message ||
                    emailValidation.message ||
                    passwordValidation.message,
            }));
        }
        username = usernameValidation.value;
        email = emailValidation.value;
        try {
            await this.createUserUseCase.execute({
                username,
                email,
                password,
                agent,
                ip,
            });
            return res.status(201).json(response_1.default(false, "usercreated"));
        }
        catch (err) {
            return res
                .status(500)
                .json(response_1.default(true, "genericerror", { stack: err.message }));
        }
    }
}
exports.CreateUserController = CreateUserController;
