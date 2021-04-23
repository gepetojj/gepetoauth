"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessToken = exports.refreshToken = exports.state = exports.redirectUrl = exports.clientId = exports.password = exports.username = void 0;
var messages_1 = __importDefault(require("./messages"));
exports.username = {
    in: ["body"],
    errorMessage: messages_1.default("invalidusername").message,
    isString: true,
    toLowerCase: true,
    isLowercase: true,
    escape: true,
    isLength: {
        errorMessage: messages_1.default("usernamelength").message,
        options: {
            min: 3,
            max: 15,
        },
    },
};
exports.password = {
    in: ["body"],
    errorMessage: messages_1.default("invalidpassword").message,
    isString: true,
    isStrongPassword: {
        errorMessage: messages_1.default("passwordrequires").message,
        options: {
            minLength: 8,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            minUppercase: 1,
        },
    },
    isLength: {
        errorMessage: messages_1.default("passwordlength").message,
        options: {
            min: 8,
            max: 24,
        },
    },
};
exports.clientId = {
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
};
exports.redirectUrl = {
    in: ["body"],
    errorMessage: messages_1.default("invalidredirecturl").message,
    isString: true,
    isURL: {
        errorMessage: "O campo 'redirect_uri' deve ser uma URL.",
        options: {
            require_valid_protocol: true,
            require_protocol: true,
        },
    },
    isLength: {
        errorMessage: messages_1.default("redirecturllength").message,
        options: {
            min: 3,
        },
    },
};
exports.state = {
    in: ["body"],
    errorMessage: "O campo 'state' está inválido.",
    isString: true,
    isLength: {
        errorMessage: "O campo 'state' deve ter mais de 5 caracteres",
        options: {
            min: 5,
        },
    },
};
exports.refreshToken = {
    in: ["query"],
    errorMessage: messages_1.default("invalidtoken").message,
    isString: true,
    escape: true,
    isLength: {
        errorMessage: messages_1.default("tokenlength").message,
        options: {
            min: 32,
        },
    },
};
exports.accessToken = {
    in: ["query"],
    errorMessage: messages_1.default("invalidtoken").message,
    isString: true,
    escape: true,
    isLength: {
        errorMessage: messages_1.default("tokenlength").message,
        options: {
            min: 32,
        },
    },
};
