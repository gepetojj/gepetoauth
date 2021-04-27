"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeUseCase = void 0;
const LoggerLoader_1 = __importDefault(require("../../loaders/LoggerLoader"));
const tokens_1 = require("../../utils/tokens");
const DayjsLoader_1 = require("../../loaders/DayjsLoader");
class AuthorizeUseCase {
    constructor(sessionsRepository) {
        this.sessionsRepository = sessionsRepository;
    }
    async execute(data) {
        try {
            const code = tokens_1.createRefreshToken();
            const dayjs = new DayjsLoader_1.DayjsLoader().execute();
            const codeWithAgentExists = await this.sessionsRepository.findCodeBySpec("agent", data.agent);
            const codeWithIpExists = await this.sessionsRepository.findCodeBySpec("ip", data.ip);
            if (codeWithAgentExists && codeWithIpExists) {
                throw new Error("Este usuário já tem um code registrado.");
            }
            await this.sessionsRepository.createNewCode({
                id: code,
                validUntil: dayjs().add(15, "minutes").valueOf(),
                agent: data.agent,
                ip: data.ip,
            });
            return code;
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            throw new Error(err.message || "Houve um erro no banco de dados.");
        }
    }
}
exports.AuthorizeUseCase = AuthorizeUseCase;
