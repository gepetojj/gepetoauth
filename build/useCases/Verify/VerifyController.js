"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyController = void 0;
const response_1 = __importDefault(require("../../utils/response"));
const LoggerLoader_1 = __importDefault(require("../../loaders/LoggerLoader"));
const validators_1 = require("../../utils/validators");
class VerifyController {
    constructor(verifyUseCase) {
        this.verifyUseCase = verifyUseCase;
    }
    async handle(req, res) {
        try {
            let accessToken = String(req.query.access_token);
            const accessTokenValidation = validators_1.validateAccessToken(accessToken);
            if (accessTokenValidation.error) {
                return res.status(400).json(response_1.default(true, "invaliddata", {
                    errors: accessTokenValidation.message,
                }));
            }
            accessToken = accessTokenValidation.value;
            const userData = await this.verifyUseCase.execute({ accessToken });
            return res.json(response_1.default(false, "validtoken", userData));
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            return res
                .status(500)
                .json(response_1.default(false, "databaseerror", { stack: err.message }));
        }
    }
}
exports.VerifyController = VerifyController;
