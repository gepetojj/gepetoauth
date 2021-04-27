"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseSessionsRepository = void 0;
const LoggerLoader_1 = __importDefault(require("../../loaders/LoggerLoader"));
const FirebaseLoader_1 = require("../../loaders/FirebaseLoader");
class FirebaseSessionsRepository {
    async createNewCode(code) {
        try {
            await FirebaseLoader_1.firestore.collection("codes").doc(code.id).create(code);
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            throw new Error(err.message);
        }
    }
    async findCode(codeId) {
        try {
            const codeQuery = await FirebaseLoader_1.firestore
                .collection("codes")
                .doc(codeId)
                .get();
            if (!codeQuery.exists) {
                return null;
            }
            const codeData = codeQuery.data();
            const code = {
                id: codeData.id,
                validUntil: codeData.validUntil,
                agent: codeData.agent,
                ip: codeData.ip,
            };
            return code;
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            throw new Error(err.message);
        }
    }
    async findCodeBySpec(spec, field) {
        try {
            const codeQuery = await FirebaseLoader_1.firestore
                .collection("codes")
                .where(spec, "==", field)
                .get();
            if (codeQuery.empty) {
                return null;
            }
            if (!codeQuery.docs[0].exists) {
                return null;
            }
            const codeData = codeQuery.docs[0].data();
            const code = {
                id: codeData.id,
                validUntil: codeData.validUntil,
                agent: codeData.agent,
                ip: codeData.ip,
            };
            return code;
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            throw new Error(err.message);
        }
    }
    async deleteCode(code) {
        try {
            await FirebaseLoader_1.firestore.collection("codes").doc(code).delete();
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            throw new Error(err.message);
        }
    }
    async createNewRefreshToken(refreshToken) {
        try {
            await FirebaseLoader_1.firestore
                .collection("sessions")
                .doc(refreshToken.id)
                .create(refreshToken);
        }
        catch (err) {
            LoggerLoader_1.default.error(err);
            throw new Error(err.message);
        }
    }
}
exports.FirebaseSessionsRepository = FirebaseSessionsRepository;
