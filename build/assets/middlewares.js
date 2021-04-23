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
exports.validateAppInfo = exports.userIp = exports.hsts = void 0;
var request_ip_1 = __importDefault(require("request-ip"));
var types_1 = require("./types");
var firebase_1 = require("./firebase");
var logger_1 = __importDefault(require("./logger"));
var response_1 = __importDefault(require("./response"));
function hsts(options) {
    var DEFAULT_MAX_AGE = 180 * 24 * 60 * 60;
    var maxAge = options.maxAge ? options.maxAge : DEFAULT_MAX_AGE;
    var includeSubDomains = options.includeSubDomains
        ? options.includeSubDomains
        : false;
    var preload = options.preload ? options.preload : false;
    var setIf = options.setIf
        ? options.setIf
        : function () {
            return true;
        };
    if (maxAge < 0) {
        throw new RangeError("HSTS maxAge must be nonnegative.");
    }
    var header = "max-age=" + Math.round(maxAge);
    if (includeSubDomains) {
        header += "; includeSubDomains";
    }
    if (preload) {
        header += "; preload";
    }
    return function hsts(req, res, next) {
        if (setIf(req, res)) {
            res.setHeader("Strict-Transport-Security", header);
        }
        next();
    };
}
exports.hsts = hsts;
function userIp() {
    return function userIp(req, res, next) {
        var userIp = request_ip_1.default.getClientIp(req);
        var ip = "";
        if (userIp === null) {
            ip = undefined;
        }
        req.clientIp = ip;
        next();
    };
}
exports.userIp = userIp;
function validateAppInfo() {
    return function validateAppInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, clientId, redirectUrl, origin, appQuery, appData, validDomains, isOriginValid, validRedirectUrls, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, clientId = _a.clientId, redirectUrl = _a.redirectUrl;
                        origin = req.hostname;
                        if (!clientId) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json(response_1.default(true, "O clientId deve ser informado.", "UNDEFINEDCLIENTID"))];
                        }
                        if (!types_1.ClientId.test(clientId)) {
                            return [2 /*return*/, res
                                    .status(400)
                                    .json(response_1.default(true, "O clientId deve ter 14 números.", "INVALIDCLIENTID"))];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, firebase_1.firestore
                                .collection("apps")
                                .doc(clientId)
                                .get()];
                    case 2:
                        appQuery = _b.sent();
                        if (!appQuery.exists) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json(response_1.default(true, "O clientId informado não é válido.", "INVALIDCLIENTID"))];
                        }
                        appData = appQuery.data();
                        if (appData === undefined) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json(response_1.default(true, "O clientId informado não é válido.", "INVALIDCLIENTID"))];
                        }
                        if (!appData.isAppValid) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json(response_1.default(true, "O clientId informado não é válido.", "INVALIDCLIENTID"))];
                        }
                        validDomains = appData.authorizedDomains;
                        isOriginValid = validDomains.includes(origin);
                        if (!isOriginValid) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json(response_1.default(true, "A origem do pedido é válida.", "INVALIDORIGIN"))];
                        }
                        validRedirectUrls = appData.redirectUrls;
                        if (redirectUrl !== undefined &&
                            !validRedirectUrls.includes(redirectUrl)) {
                            return [2 /*return*/, res
                                    .status(401)
                                    .json(response_1.default(true, "O redirectUrl informado não é válido.", "INVALIDREDIRECTURL"))];
                        }
                        return [2 /*return*/, next()];
                    case 3:
                        err_1 = _b.sent();
                        logger_1.default.error(err_1);
                        return [2 /*return*/, res
                                .status(500)
                                .json(response_1.default(true, "Houve um erro interno.", "DATABASEERROR"))];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
}
exports.validateAppInfo = validateAppInfo;
