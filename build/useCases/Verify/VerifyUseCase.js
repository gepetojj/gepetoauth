"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyUseCase = void 0;
const DayjsLoader_1 = require("../../loaders/DayjsLoader");
const tokens_1 = require("../../utils/tokens");
class VerifyUseCase {
    async execute(data) {
        const dayjs = new DayjsLoader_1.DayjsLoader().execute();
        const { valid, payload } = tokens_1.verifyAccessToken(data.accessToken);
        if (!valid) {
            throw new Error("Access token inválido.");
        }
        const nowInTimestamp = dayjs().valueOf();
        if (nowInTimestamp > payload.validUntil) {
            throw new Error("Access token expirado.");
        }
        return { data: payload.payload };
    }
}
exports.VerifyUseCase = VerifyUseCase;
