"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCode = exports.validatePassword = exports.validateEmail = exports.validateUsername = void 0;
const validator_1 = __importDefault(require("validator"));
const response_1 = require("./response");
function validateUsername(username) {
    if (!username) {
        return { error: true, message: response_1.messages.invalidusername };
    }
    if (validator_1.default.isEmpty(username)) {
        return { error: true, message: response_1.messages.invalidusername };
    }
    if (!validator_1.default.isLength(username, { min: 3, max: 15 })) {
        return { error: true, message: response_1.messages.usernamelength };
    }
    const sanitizedUsername = validator_1.default.escape(username);
    return { error: false, value: sanitizedUsername };
}
exports.validateUsername = validateUsername;
function validateEmail(email) {
    if (!email) {
        return { error: true, message: response_1.messages.invalidemail };
    }
    if (validator_1.default.isEmpty(email)) {
        return { error: true, message: response_1.messages.invalidemail };
    }
    if (!validator_1.default.isEmail(email)) {
        return { error: true, message: response_1.messages.invalidemail };
    }
    const sanitizedEmail = validator_1.default.normalizeEmail(email) || email;
    return { error: false, value: sanitizedEmail };
}
exports.validateEmail = validateEmail;
function validatePassword(password) {
    if (!password) {
        return { error: true, message: response_1.messages.invalidpassword };
    }
    if (validator_1.default.isEmpty(password)) {
        return { error: true, message: response_1.messages.invalidpassword };
    }
    if (!validator_1.default.isLength(password, { min: 8, max: 24 })) {
        return { error: true, message: response_1.messages.passwordlength };
    }
    if (!validator_1.default.isStrongPassword(password, { minLength: 8 })) {
        return { error: true, message: response_1.messages.passwordrequires };
    }
    return { error: false, value: password };
}
exports.validatePassword = validatePassword;
function validateCode(code) {
    if (!code) {
        return { error: true, message: response_1.messages.invalidcode };
    }
    let codeSanitized = validator_1.default.trim(code);
    codeSanitized = validator_1.default.escape(codeSanitized);
    if (validator_1.default.isEmpty(codeSanitized)) {
        return { error: true, message: response_1.messages.invalidcode };
    }
    if (!validator_1.default.isLength(codeSanitized, { min: 32, max: 32 })) {
        return { error: true, message: response_1.messages.codelength };
    }
    return { error: false, value: codeSanitized };
}
exports.validateCode = validateCode;
