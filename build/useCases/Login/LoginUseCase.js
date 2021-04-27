"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const DayjsLoader_1 = require("../../loaders/DayjsLoader");
const tokens_1 = require("../../utils/tokens");
class LoginUseCase {
    constructor(sessionsRepository, usersRepository) {
        this.sessionsRepository = sessionsRepository;
        this.usersRepository = usersRepository;
    }
    async execute(data) {
        const dayjs = new DayjsLoader_1.DayjsLoader().execute();
        const codeExists = await this.sessionsRepository.findCode(data.code);
        if (!codeExists) {
            throw new Error("Code inválido.");
        }
        const nowInTimestamp = dayjs().valueOf();
        if (nowInTimestamp > codeExists.validUntil) {
            throw new Error("Code expirado.");
        }
        if (data.agent !== codeExists.agent && data.ip !== codeExists.ip) {
            throw new Error("Dispositivo inválido. Tente novamente usando o mesmo dispositivo que antes.");
        }
        const userExists = await this.usersRepository.findByUsername(data.username);
        if (!userExists) {
            throw new Error("Usuário inexistente.");
        }
        const passwordMatch = await bcrypt_1.default.compare(data.password, userExists.password);
        if (!passwordMatch) {
            throw new Error("Senha inválida.");
        }
        const refreshToken = tokens_1.createRefreshToken();
        const refreshTokenValidity = dayjs().add(7, "days").valueOf();
        await this.sessionsRepository.createNewRefreshToken({
            id: refreshToken,
            validUntil: refreshTokenValidity,
            agent: data.agent,
            ip: data.ip,
        });
        const accessToken = tokens_1.createAccessToken({
            username: userExists.username,
            email: userExists.email,
            avatar: userExists.avatar,
            level: userExists.level,
            registerDate: userExists.register.date,
            state: userExists.state,
        });
        await this.sessionsRepository.deleteCode(data.code);
        return { refreshToken, accessToken };
    }
}
exports.LoginUseCase = LoginUseCase;
