"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var dayjs_1 = __importDefault(require("dayjs"));
var utc_1 = __importDefault(require("dayjs/plugin/utc"));
var timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
var firebase_1 = require("../../assets/firebase");
var middlewares_1 = require("../../assets/middlewares");
var tokens_1 = require("../../assets/tokens");
var response_1 = __importDefault(require("../../assets/response"));
var logger_1 = __importDefault(require("../../assets/logger"));
var messages_1 = __importDefault(require("../../assets/messages"));
var router = express_1.Router();
var schema = {
    code: {
        in: ["query"],
        errorMessage: messages_1.default("invalidcode").message,
        isString: true,
        escape: true,
        isLength: {
            errorMessage: messages_1.default("codelength").message,
            options: {
                min: 32,
                max: 32,
            },
        },
    },
    clientId: {
        in: ["body"],
        errorMessage: messages_1.default("invalidclientid").message,
        isString: true,
        escape: true,
        isLength: {
            errorMessage: messages_1.default("clientidlength").message,
            options: {
                min: 14,
                max: 14,
            },
        },
    },
};
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.tz.setDefault("America/Maceio");
function verifyCodeAndGetInfo(code) {
    return __awaiter(this, void 0, void 0, function () {
        var codeQuery, codeData, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, firebase_1.firestore.collection("codes").doc(code).get()];
                case 1:
                    codeQuery = _a.sent();
                    if (!codeQuery.exists) {
                        return [2 /*return*/, [false]];
                    }
                    codeData = codeQuery.data() || {};
                    data = {
                        code: codeData.code,
                        validUntil: codeData.validUntil,
                        origin: codeData.origin,
                        user: codeData.user,
                    };
                    return [2 /*return*/, [true, data]];
                case 2:
                    err_1 = _a.sent();
                    logger_1.default.error(err_1);
                    return [2 /*return*/, [false]];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function addSessionData(refreshToken, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenData, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    tokenData = {
                        createdAt: dayjs_1.default().valueOf(),
                        validUntil: dayjs_1.default().add(7, "days").valueOf(),
                        userId: userId,
                    };
                    return [4 /*yield*/, firebase_1.firestore
                            .collection("sessions")
                            .doc(refreshToken)
                            .create(tokenData)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_2 = _a.sent();
                    logger_1.default.error(err_2);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function deleteCode(code) {
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, firebase_1.firestore.collection("codes").doc(code).delete()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_3 = _a.sent();
                    logger_1.default.error(err_3);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
router.get("/", express_validator_1.checkSchema(schema), middlewares_1.validateAppInfo(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, code, origin, codeVerification, codeData, now, refreshToken, accessToken, sessionData, codeDelete;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res
                            .status(400)
                            .json(response_1.default(true, messages_1.default("invaliddata").message, messages_1.default("invaliddata").error, { errors: errors.array() }))];
                }
                code = req.query.code;
                origin = req.hostname;
                code = (code === null || code === void 0 ? void 0 : code.toString()) || "";
                return [4 /*yield*/, verifyCodeAndGetInfo(code)];
            case 1:
                codeVerification = _a.sent();
                if (!codeVerification[0]) {
                    return [2 /*return*/, res
                            .status(400)
                            .json(response_1.default(true, messages_1.default("invalidcode").message, messages_1.default("invalidcode").error))];
                }
                codeData = {
                    code: "",
                    validUntil: 0,
                    origin: "",
                    user: {
                        id: "",
                        username: "",
                        email: "",
                        password: "",
                        avatar: "",
                        level: 0,
                        state: {
                            banned: { is: false },
                            emailConfirmed: true,
                        },
                        register: {
                            date: 0,
                            agent: "",
                            ip: "",
                        },
                        apps: [],
                    },
                };
                if (codeVerification[1] !== undefined) {
                    codeData = codeVerification[1];
                }
                now = dayjs_1.default().valueOf();
                if (now > codeData.validUntil) {
                    return [2 /*return*/, res
                            .status(401)
                            .json(response_1.default(true, messages_1.default("expiredcode").message, messages_1.default("expiredcode").error))];
                }
                if (origin !== codeData.origin) {
                    return [2 /*return*/, res
                            .status(401)
                            .json(response_1.default(true, messages_1.default("invalidorigin").message, messages_1.default("invalidorigin").error))];
                }
                refreshToken = tokens_1.createRefreshToken();
                accessToken = tokens_1.createAccessToken({
                    id: codeData.user.id,
                    name: codeData.user.username,
                    email: codeData.user.email,
                    avatar: codeData.user.avatar,
                    registerDate: codeData.user.register.date,
                    apps: codeData.user.apps,
                });
                return [4 /*yield*/, addSessionData(refreshToken, codeData.user.id)];
            case 2:
                sessionData = _a.sent();
                if (!sessionData) {
                    return [2 /*return*/, res
                            .status(500)
                            .json(response_1.default(true, messages_1.default("databaseerror").message, messages_1.default("databaseerror").error))];
                }
                return [4 /*yield*/, deleteCode(codeData.code)];
            case 3:
                codeDelete = _a.sent();
                if (!codeDelete) {
                    return [2 /*return*/, res
                            .status(500)
                            .json(response_1.default(true, messages_1.default("databaseerror").message, messages_1.default("databaseerror").error))];
                }
                if (req.session !== undefined && req.session !== null) {
                    req.session.token = refreshToken;
                }
                return [2 /*return*/, res.json(response_1.default(false, messages_1.default("authorized").message, undefined, {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    }))];
        }
    });
}); });
exports.default = router;
