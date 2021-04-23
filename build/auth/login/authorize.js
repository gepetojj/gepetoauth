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
var bcrypt_1 = __importDefault(require("bcrypt"));
var dayjs_1 = __importDefault(require("dayjs"));
var utc_1 = __importDefault(require("dayjs/plugin/utc"));
var timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
var firebase_1 = require("../../assets/firebase");
var middlewares_1 = require("../../assets/middlewares");
var tokens_1 = require("../../assets/tokens");
var validators_1 = require("../../assets/validators");
var response_1 = __importDefault(require("../../assets/response"));
var logger_1 = __importDefault(require("../../assets/logger"));
var messages_1 = __importDefault(require("../../assets/messages"));
var router = express_1.Router();
var schema = {
    username: validators_1.username,
    password: validators_1.password,
    client_id: validators_1.clientId,
    redirect_uri: validators_1.redirectUrl,
    state: validators_1.state,
};
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
dayjs_1.default.tz.setDefault("America/Maceio");
function getAppInfo(clientId) {
    return __awaiter(this, void 0, void 0, function () {
        var appQuery, data, isAppValid, appInfo, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, firebase_1.firestore.collection("apps").doc(clientId).get()];
                case 1:
                    appQuery = _a.sent();
                    data = appQuery.data();
                    if (data !== undefined) {
                        isAppValid = data.isAppValid;
                        if (isAppValid) {
                            appInfo = {
                                app: data.app,
                                author: data.author,
                                clientId: data.clientId,
                                isAppValid: isAppValid,
                                redirectUrls: data.redirectUrls,
                                authorizedDomains: data.authorizedDomains,
                            };
                            return [2 /*return*/, appInfo];
                        }
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, false];
                case 2:
                    err_1 = _a.sent();
                    logger_1.default.error(err_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function checkUsernameAndGetInfo(username) {
    return __awaiter(this, void 0, void 0, function () {
        var userQuery, userDoc, userData, user, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, firebase_1.firestore
                            .collection("users")
                            .where("username", "==", username)
                            .get()];
                case 1:
                    userQuery = _a.sent();
                    if (userQuery.empty) {
                        return [2 /*return*/, [false]];
                    }
                    userDoc = userQuery.docs[0];
                    if (!userDoc.exists) {
                        return [2 /*return*/, [false]];
                    }
                    userData = userDoc.data();
                    user = {
                        id: userData.id,
                        username: userData.username,
                        email: userData.email,
                        password: userData.password,
                        avatar: userData.avatar,
                        level: userData.level,
                        state: userData.state,
                        register: userData.register,
                        apps: userData.apps,
                    };
                    return [2 /*return*/, [true, user]];
                case 2:
                    err_2 = _a.sent();
                    logger_1.default.error(err_2);
                    return [2 /*return*/, [false]];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function checkPasswords(password, hash) {
    return __awaiter(this, void 0, void 0, function () {
        var match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt_1.default.compare(password, hash)];
                case 1:
                    match = _a.sent();
                    return [2 /*return*/, match];
            }
        });
    });
}
function registerNewCode(codeObj) {
    return __awaiter(this, void 0, void 0, function () {
        var codeVerification, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, firebase_1.firestore
                            .collection("codes")
                            .doc(codeObj.code)
                            .get()];
                case 1:
                    codeVerification = _a.sent();
                    if (!!codeVerification.exists) return [3 /*break*/, 3];
                    return [4 /*yield*/, firebase_1.firestore
                            .collection("codes")
                            .doc(codeObj.code)
                            .create(codeObj)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3: return [2 /*return*/, false];
                case 4:
                    err_3 = _a.sent();
                    logger_1.default.error(err_3);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
}
router.post("/", express_validator_1.checkSchema(schema), middlewares_1.validateAppInfo(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, username, password, clientId, redirectUrl, state, appInfo, usernameCheck, userData, passwordCheck, code, validUntil, codeObj, insertCode;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res
                            .status(400)
                            .json(response_1.default(true, messages_1.default("invaliddata").message, messages_1.default("invaliddata").error, { errors: errors.array() }))];
                }
                _a = req.body, username = _a.username, password = _a.password, clientId = _a.clientId, redirectUrl = _a.redirectUrl;
                state = req.query;
                return [4 /*yield*/, getAppInfo(clientId)];
            case 1:
                appInfo = _b.sent();
                if (appInfo === false) {
                    return [2 /*return*/, res
                            .status(500)
                            .json(response_1.default(true, messages_1.default("databaseerror").message, messages_1.default("databaseerror").error))];
                }
                return [4 /*yield*/, checkUsernameAndGetInfo(username)];
            case 2:
                usernameCheck = _b.sent();
                if (!usernameCheck[0]) {
                    return [2 /*return*/, res
                            .status(400)
                            .json(response_1.default(true, messages_1.default("invalidusername").message, messages_1.default("invalidusername").error))];
                }
                if (!(usernameCheck[1] !== undefined)) return [3 /*break*/, 4];
                userData = usernameCheck[1];
                return [4 /*yield*/, checkPasswords(password, userData.password)];
            case 3:
                passwordCheck = _b.sent();
                if (!passwordCheck) {
                    return [2 /*return*/, res
                            .status(400)
                            .json(response_1.default(true, messages_1.default("invalidpassword").message, messages_1.default("invalidpassword").error))];
                }
                if (userData.state.banned.is) {
                    return [2 /*return*/, res
                            .status(401)
                            .json(response_1.default(true, messages_1.default("userbanned").message, messages_1.default("userbanned").error, { reason: userData.state.banned.reason }))];
                }
                if (!userData.state.emailConfirmed) {
                    return [2 /*return*/, res
                            .status(401)
                            .json(response_1.default(true, messages_1.default("emailnotconfirmed").message, messages_1.default("emailnotconfirmed").error))];
                }
                _b.label = 4;
            case 4:
                code = tokens_1.createRefreshToken();
                validUntil = dayjs_1.default().add(1, "hour").valueOf();
                codeObj = {
                    code: code,
                    validUntil: validUntil,
                    origin: req.hostname,
                    user: usernameCheck[1] === undefined
                        ? {
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
                        }
                        : usernameCheck[1],
                };
                return [4 /*yield*/, registerNewCode(codeObj)];
            case 5:
                insertCode = _b.sent();
                if (!insertCode) {
                    return [2 /*return*/, res
                            .status(500)
                            .json(response_1.default(true, messages_1.default("databaseerror").message, messages_1.default("databaseerror").error))];
                }
                return [2 /*return*/, res.redirect(redirectUrl + "?code=" + code + "&state=" + state)];
        }
    });
}); });
exports.default = router;
